#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod cache;
mod firebase;

use cache::{start_background_updater, StockCandle};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HistoricalData {
    pub timestamp: String,
    pub price: f64,
}

#[tauri::command]
async fn create_user(
    email: String,
    password: String,
    name: String,
    surname: String,
) -> Result<String, String> {
    auth::create_user(&email, &password, &name, &surname).await
}

#[tauri::command]
async fn authenticate_user(email: String, password: String) -> Result<String, String> {
    auth::authenticate_user(&email, &password).await
}

#[tauri::command]
async fn save_user(
    email: String,
    password: String,
    name: String,
    surname: String,
) -> Result<String, String> {
    auth::save_user(&email, &password, &name, &surname).await
}

#[tauri::command]
async fn get_coins_data() -> Result<HashMap<String, Vec<StockCandle>>, String> {
    cache::get_coins_data().await
}

#[tauri::command]
async fn get_historical_ticks(
    coin_ids: Vec<String>,
    start: String,
    interval: String,
) -> Result<String, String> {
    let ticks = cache::get_historical_ticks(coin_ids, start, interval).await?;
    serde_json::to_string(&ticks).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_user_portfolio(email: String, password: String) -> Result<String, String> {
    match auth::get_user_portfolio(&email, &password).await {
        Ok(portfolio) => {
            let json_str = serde_json::to_string(&portfolio)
                .map_err(|e| format!("Serialization error: {:?}", e))?;
            Ok(json_str)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
async fn get_user_trades(email: String, password: String) -> Result<String, String> {
    match auth::get_user_trades(&email, &password).await {
        Ok(trades) => {
            let json_str = serde_json::to_string(&trades)
                .map_err(|e| format!("Serialization error: {:?}", e))?;
            Ok(json_str)
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
async fn add_user_trade(
    email: String,
    password: String,
    crypto_name: String,
    amount: f64,
    action: String,
    price: f64,
    date: String,
) -> Result<f64, String> {
    match auth::add_user_trade(
        &email,
        &password,
        &crypto_name,
        &amount,
        &action,
        &price,
        &date,
    )
    .await
    {
        Ok(balance) => Ok(balance),
        Err(err) => Err(format!("Error executing trade: {:?}", err)),
    }
}

#[tauri::command]
async fn get_user_balance(local_id: String) -> Result<f64, String> {
    cache::get_user_balance(local_id).await
}

#[tauri::command]
async fn check_daily_balance(email: String, password: String) -> Result<bool, String> {
    auth::check_daily_balance(&email, &password).await
}

#[tauri::command]
async fn add_daily_balance(email: String, password: String, value: f64) -> Result<f64, String> {
    auth::add_daily_balance(&email, &password, value).await
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    tokio::spawn(async {
        start_background_updater().await;
    });
    println!("App has launched!");

    // Run the Tauri application
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_coins_data,
            create_user,
            get_historical_ticks,
            authenticate_user,
            save_user,
            get_user_trades,
            get_user_portfolio,
            add_user_trade,
            get_user_balance,
            check_daily_balance,
            add_daily_balance,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
