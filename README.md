<h1>solana-transactions-wrapper</h1>

<p>Handy tool to execute buy/sell transactions on the SOLANA chain.</p>

<h2>Installation</h2>

<p>Install the package with npm:</p>

<pre><code>npm install solana-transactions-wrapper</code></pre>

<h2>Usage</h2>

<h3>Importing the package</h3>

<pre><code>import { buy_token, sell_token, get_tokens } from 'solana-transactions-wrapper';</code></pre>

<h3>Buying a token</h3>

<pre><code>const txid = await buy_token(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY,
  ADDRESS_OF_TOKEN_TO_BUY,
  AMOUNT_OF_SOLANA_TO_SPEND,
  SLIPPAGE
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to buy from.</li>
  <li><strong>ADDRESS_OF_TOKEN_TO_BUY:</strong> The address of the token you want to buy.</li>
  <li><strong>AMOUNT_OF_SOLANA_TO_SPEND:</strong> The amount of SOL you want to spend.</li>
  <li><strong>SLIPPAGE:</strong> The slippage you want to use (default 1%).</li>
</ul>

<p>This function returns a promise that resolves to the transaction id of the buy operation.</p>

<h3>Selling a token</h3>

<pre><code>const txid = await sell_token(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY,
  ADDRESS_OF_TOKEN_TO_SELL,
  AMOUNT_OF_TOKEN_TO_SELL,
  SLIPPAGE
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to sell from.</li>
  <li><strong>ADDRESS_OF_TOKEN_TO_SELL:</strong> The address of the token you want to sell.</li>
  <li><strong>AMOUNT_OF_TOKEN_TO_SELL:</strong> The amount of the token you want to sell.</li>
  <li><strong>SLIPPAGE:</strong> The slippage you want to use (default 1%).</li>
</ul>

<p>This function returns a promise that resolves to the transaction id of the sell operation.</p>

<h3>Getting account tokens</h3>

<pre><code>const tokens: TokensObject = await get_tokens(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to get the tokens from.</li>
</ul>

<p>This function returns a promise that resolves to an object mapping token addresses to their balance and symbol.</p>

<h2>Types</h2>

<p>This package exports a <code>TokensObject</code> type that you can use to type the result of <code>getAccountTokens</code>.</p>

<pre><code>import { TokensObject } from 'solana-transactions-wrapper';</code></pre>

<p><code>TokensObject</code> is a record where each key is a token address (string), and the value is an object with properties <code>symbol</code> (string) and <code>balance</code> (number).</p>

<h2>Dependencies</h2>

<p>This package depends other packages, Please make sure to install them</p>
