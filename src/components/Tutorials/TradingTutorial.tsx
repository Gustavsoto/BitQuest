export const TradingTutorial = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 dark:text-white">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          How to Read the Most Popular Candlestick Patterns
        </h1>
        <p className="text-sm text-gray-500">
          Beginner · Published May 5, 2023 · Updated Mar 12, 2025 · 11m read
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Key Takeaways</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Candlestick charts are a popular tool in technical analysis.</li>
          <li>
            Patterns like hammer, doji, and shooting star help identify trends.
          </li>
          <li>
            Volume, sentiment, and liquidity should also be considered when
            trading.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What Are Candlesticks?</h2>
        <p>
          Candlesticks are visual representations of price movements that
          originated in 18th-century Japan. They are used to analyze market
          sentiment and predict future movements by identifying patterns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How Do Candlestick Charts Work?
        </h2>
        <p>
          Each candlestick shows the open, close, high, and low prices for a
          specific time period. Green indicates rising prices, while red signals
          a price drop.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Bullish Candlestick Patterns</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Hammer:</strong> Long lower wick, suggests buyers overcame
            selling pressure.
          </li>
          <li>
            <strong>Inverted Hammer:</strong> Long upper wick, potential
            reversal after a downtrend.
          </li>
          <li>
            <strong>Three White Soldiers:</strong> Three green candles, strong
            buyer control.
          </li>
          <li>
            <strong>Bullish Harami:</strong> Small green candle inside a
            previous red one.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Bearish Candlestick Patterns</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Hanging Man:</strong> After an uptrend, signals potential
            reversal.
          </li>
          <li>
            <strong>Shooting Star:</strong> Long upper wick, short body,
            suggests a local top.
          </li>
          <li>
            <strong>Three Black Crows:</strong> Three red candles, strong seller
            control.
          </li>
          <li>
            <strong>Bearish Harami:</strong> Small red candle inside a prior
            green one.
          </li>
          <li>
            <strong>Dark Cloud Cover:</strong> Red candle that closes below
            midpoint of the green one.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Continuation Patterns</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Rising Three Methods:</strong> Small red candles within
            uptrend followed by continuation.
          </li>
          <li>
            <strong>Falling Three Methods:</strong> Small green candles within
            downtrend followed by continuation.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Doji Candlestick Patterns</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Gravestone Doji:</strong> Bearish reversal, long upper wick.
          </li>
          <li>
            <strong>Long-Legged Doji:</strong> Indecision, long upper and lower
            wicks.
          </li>
          <li>
            <strong>Dragonfly Doji:</strong> Potential reversal depending on
            context.
          </li>
        </ul>
        <p>
          Spinning tops are similar to dojis but with slight variation in open
          and close prices.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Using Candlestick Patterns in Crypto Trading
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>
            Learn the basics before applying candlestick analysis in trades.
          </li>
          <li>Use candlestick patterns with indicators like RSI or MACD.</li>
          <li>Analyze across multiple timeframes for better context.</li>
          <li>
            Always apply risk management strategies like stop-loss orders.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Closing Thoughts</h2>
        <p>
          Candlestick patterns offer valuable insight into price action but
          should be used alongside other tools and solid risk management
          practices.
        </p>
      </section>
    </div>
  );
};
