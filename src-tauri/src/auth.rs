use crate::{
    cache::{self, BALANCE_CACHE},
    firebase::{self, Portfolio, Trade, User},
};
use firebase_auth_sdk::FireAuth;
use firebase_rs::Firebase;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticatedUser {
    pub id_token: String,
    pub local_id: String,
    pub user_info: User,
}

pub async fn create_user(
    email: &String,
    password: &String,
    name: &String,
    surname: &String,
) -> Result<String, String> {
    let api_key = get_api_key("FIREBASE_AUTH_KEY").ok_or("Missing FIREBASE_AUTH_KEY")?;
    let auth = FireAuth::new(api_key);

    // Izveido epastu iekšā firebase un atgriez JWT ar lokālo ID
    let response = auth
        .sign_up_email(email, password, true)
        .await
        .map_err(|e| format!("Sign-up failed: {:?}", e))?;

    let uri = get_api_key("FIREBASE_URI").ok_or("Missing FIREBASE_URI")?;
    let firebase = Firebase::auth(&uri, &response.id_token)
        .map_err(|e| format!("Firebase auth error: {:?}", e))?;
    let user = User {
        name: name.clone(),
        lastname: surname.clone(),
        email: email.clone(),
        password: password.clone(),
    };

    // Ievieto jauno lietotāju iekšā firebase users tabulā kā arī piereģistrē balancu un datumu kad saņemts daily bonuss
    let created_user = firebase::set_user(&firebase, &user, &response.local_id).await;
    firebase::set_user_balance(&firebase, &10000.00, &response.local_id).await;
    firebase::set_daily_balance(&firebase, &response.local_id).await;

    let result = AuthenticatedUser {
        id_token: response.id_token,
        local_id: response.local_id.clone(),
        user_info: created_user,
    };

    let json =
        serde_json::to_string(&result).map_err(|e| format!("Serialization error: {:?}", e))?;
    Ok(json)
}

pub async fn authenticate_user(email: &String, password: &String) -> Result<String, String> {
    let (firebase, uid, id_token) = authenticate_and_get_firebase(email, password).await?;

    let user_data = firebase::get_user(&firebase, &uid).await;
    let balance = firebase::get_user_balance(&firebase, &uid).await;

    // Iekešo balancu, jo šis tiek pieprasīts ļoti daudz (manuāli tiek kontrolēts kešotais balanss)
    if let Ok(balance_val) = balance {
        let mut cache = BALANCE_CACHE.lock().await;
        cache.insert(uid.clone(), balance_val);
    }

    let result = AuthenticatedUser {
        id_token,
        local_id: uid,
        user_info: user_data,
    };

    // Pārtaisa uz json stringu lai frontend saprastu
    let json =
        serde_json::to_string(&result).map_err(|e| format!("Serialization error: {:?}", e))?;

    Ok(json)
}

pub async fn get_user_trades(email: &str, password: &str) -> Result<Vec<Trade>, String> {
    let (firebase, uid, _) = authenticate_and_get_firebase(email, password).await?;
    let trade_data = firebase::get_trades(&firebase, &uid)
        .await
        .map_err(|e| format!("Trade fetch error: {:?}", e))?;
    Ok(trade_data)
}

pub async fn get_user_portfolio(email: &str, password: &str) -> Result<Portfolio, String> {
    let (firebase, uid, _) = authenticate_and_get_firebase(email, password).await?;

    // Ja ir jau iekešots paņem portfolio no tā
    if let Some(cached_portfolio) = cache::get_cached_user_portfolio(&uid).await {
        return Ok(cached_portfolio);
    }

    // Ja nav iekešots taisa pieprasījumu uz firebase
    let portfolio = firebase::get_user_portfolio(&firebase, &uid).await?;

    // Jaunais portfolio iekešots
    let mut cache = cache::PORTFOLIO_CACHE.lock().await;
    cache.insert(uid.clone(), portfolio.clone());

    Ok(portfolio)
}

pub async fn check_daily_balance(email: &String, password: &String) -> Result<bool, String> {
    let (firebase, uid, _) = authenticate_and_get_firebase(email, password).await?;
    firebase::check_daily_balance(&firebase, &uid).await
}

pub async fn add_daily_balance(
    email: &String,
    password: &String,
    value: f64,
) -> Result<f64, String> {
    let (firebase, uid, _) = authenticate_and_get_firebase(email, password).await?;
    firebase::add_daily_balance(&firebase, &uid, &value).await
}

pub async fn add_user_trade(
    email: &String,
    password: &String,
    crypto_name: &String,
    amount: &f64,
    action: &String,
    price: &f64,
    date: &String,
) -> Result<f64, String> {
    let (firebase, uid, _) = authenticate_and_get_firebase(email, password).await?;
    let new_balance =
        firebase::add_trade(&firebase, &uid, crypto_name, amount, action, price, date).await?;
    Ok(new_balance)
}

// Šo izmanto settings skats (lai saglabātu lietotaja datus)
pub async fn save_user(
    email: &String,
    password: &String,
    name: &String,
    surname: &String,
) -> Result<String, String> {
    let (firebase, uid, id_token) = authenticate_and_get_firebase(email, password).await?;
    let user = User {
        name: name.clone(),
        lastname: surname.clone(),
        email: email.clone(),
        password: password.clone(),
    };
    let user_data = firebase::update_user(&firebase, &uid, &user).await;
    let result = AuthenticatedUser {
        id_token,
        local_id: uid,
        user_info: user_data,
    };
    let json =
        serde_json::to_string(&result).map_err(|e| format!("Serialization error: {:?}", e))?;
    Ok(json)
}

// Piekļuve visam API atslēgām un URI (CoinGecko, Firebase URI un auth atslēga)
pub fn get_api_key(key_name: &str) -> Option<String> {
    env::var(key_name).ok()
}

//Šādi notiek autentifikācija lai vispār piekļūtu firebase slānim
pub async fn authenticate_and_get_firebase(
    email: &str,
    password: &str,
) -> Result<(Firebase, String, String), String> {
    let api_key = get_api_key("FIREBASE_AUTH_KEY").ok_or("Missing FIREBASE_AUTH_KEY")?;
    let auth = FireAuth::new(api_key);

    let response = auth
        .sign_in_email(email, password, true)
        .await
        .map_err(|e| format!("Sign-in failed: {:?}", e))?;

    let uri = get_api_key("FIREBASE_URI").ok_or("Missing FIREBASE_URI")?;

    let firebase = Firebase::auth(&uri, &response.id_token)
        .map_err(|e| format!("Firebase auth error: {:?}", e))?;

    Ok((firebase, response.local_id, response.id_token))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tokio;

    #[test]
    fn test_get_api_key_reads_env_vars() {
        let orig_auth_key = std::env::var("FIREBASE_AUTH_KEY").ok();
        let orig_uri = std::env::var("FIREBASE_URI").ok();

        std::env::set_var("FIREBASE_AUTH_KEY", "dummy_key");
        std::env::set_var("FIREBASE_URI", "dummy_uri");

        assert_eq!(
            Some("dummy_key".to_string()),
            get_api_key("FIREBASE_AUTH_KEY")
        );
        assert_eq!(Some("dummy_uri".to_string()), get_api_key("FIREBASE_URI"));

        // Restore
        if let Some(k) = orig_auth_key {
            std::env::set_var("FIREBASE_AUTH_KEY", k);
        } else {
            std::env::remove_var("FIREBASE_AUTH_KEY");
        }
        if let Some(u) = orig_uri {
            std::env::set_var("FIREBASE_URI", u);
        } else {
            std::env::remove_var("FIREBASE_URI");
        }
    }

    #[tokio::test]
    async fn test_create_user_fails_if_env_missing() {
        // Ensure env vars are not set or empty
        std::env::remove_var("FIREBASE_AUTH_KEY");
        std::env::remove_var("FIREBASE_URI");

        let email = "test@test.test".to_string();
        let password = "password".to_string();
        let name = "John".to_string();
        let surname = "Doe".to_string();

        let result = create_user(&email, &password, &name, &surname).await;
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Missing FIREBASE_AUTH_KEY");
    }

    #[tokio::test]
    async fn test_authenticate_user_fails_if_env_missing() {
        std::env::remove_var("FIREBASE_AUTH_KEY");
        std::env::remove_var("FIREBASE_URI");

        let email = "test@example.com".to_string();
        let password = "password".to_string();

        let result = authenticate_user(&email, &password).await;
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Missing FIREBASE_AUTH_KEY");
    }

    #[test]
    fn test_get_api_key_returns_none_if_missing() {
        std::env::remove_var("FIREBASE_AUTH_KEY");
        assert_eq!(get_api_key("FIREBASE_AUTH_KEY"), None);
        std::env::remove_var("FIREBASE_URI");
        assert_eq!(get_api_key("FIREBASE_URI"), None);
    }
}
