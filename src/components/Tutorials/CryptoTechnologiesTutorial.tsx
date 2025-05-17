export const CryptoTechnologiesTutorial = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-center">
        What's a cryptocurrency?
      </h1>

      <p>
        A cryptocurrency is just like a digital form of cash. You can use it to
        pay friends for your share of the bar tab, buy that new pair of socks
        you've been eyeing up, or book flights and hotels for your next holiday.
        Because cryptocurrency is digital, it can also be sent to friends and
        family anywhere in the world.
      </p>

      <h2 className="text-2xl font-semibold mt-6">
        Just like PayPal or bank transfers, right?
      </h2>
      <p>
        Well, not really. It's way more interesting! You see, traditional online
        payment gateways are owned by organizations. They hold your money for
        you, and you need to ask them to transfer it on your behalf when you
        want to spend it.
      </p>
      <p>
        In cryptocurrencies, there isn't an organization. You, your friends, and
        thousands of others can act as your own banks by running free software.
        Your computer connects with other people's computers, meaning you
        communicate directly - no middlemen required!
      </p>
      <p>
        To use cryptocurrency, you don't need to sign up for a website with an
        email address and password. You can download a wide variety of apps onto
        your smartphone to begin sending and receiving within minutes.
      </p>

      <h2 className="text-2xl font-semibold mt-6">
        Why do they call it cryptocurrency?
      </h2>
      <p>
        The name cryptocurrency is a combination of{" "}
        <strong>cryptography</strong> and <strong>currency</strong>. With
        cryptography, we use advanced math to secure our funds, making sure that
        nobody else can spend them.
      </p>
      <p>
        There's no need to understand all this – applications you use will do
        all the heavy lifting. You won't even know what's going on under the
        hood.
      </p>
      <p>
        If you're interested in that kind of thing, though, we've got a few
        articles for you:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>What is Public-Key Cryptography?</li>
        <li>History of Cryptography</li>
        <li>Symmetric vs. Asymmetric Encryption</li>
        <li>What is a Digital Signature?</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">Why should you care?</h2>
      <p>
        So, this magical internet money isn't owned by anyone and uses
        cryptography to secure the system. But you've already got apps for
        paying people - why should you care?
      </p>
      <ul className="space-y-2">
        <li>
          <strong>Permissionless:</strong> No one can stop you from using
          cryptocurrency. Centralized payment services, on the other hand, can
          freeze accounts or prevent transactions.
        </li>
        <li>
          <strong>Censorship-resistant:</strong> The network is designed to be
          virtually impossible to shut down.
        </li>
        <li>
          <strong>Fast & Cheap:</strong> Send money across the world within
          seconds - at a fraction of the cost of international transfers.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">What about Bitcoin?</h2>
      <p>
        That ₿ Bitcoin thing your friend or family member keeps talking about?
        That's the original cryptocurrency, and, to date, the most popular.
      </p>
      <p>
        <strong>Who invented Bitcoin?</strong>
        <br />
        Amazingly, nobody knows. We only know them by their screen name –{" "}
        <em>Satoshi Nakamoto</em>. Satoshi could be a single person, a group of
        programmers, or (if you believe the theories) a time-traveling alien or
        secret government team.
      </p>
      <p>
        Satoshi published a 9-page document in 2008, detailing how the Bitcoin
        system worked. Months later, in 2009, the software was released.
      </p>
      <p>
        Bitcoin provided the foundation for many other cryptocurrencies. Some
        were based on the same software, while others took a different approach.
      </p>

      <h2 className="text-2xl font-semibold mt-6">
        Are all cryptocurrencies the same?
      </h2>
      <p>
        Not at all! Some are faster, more private, more secure, or more
        programmable.
      </p>
      <p>
        There's a common saying in the crypto space:{" "}
        <strong>Do Your Own Research (DYOR)</strong>. It's not rude - it just
        means don't rely on a single source of truth. Always do your due
        diligence before investing.
      </p>
    </div>
  );
};
