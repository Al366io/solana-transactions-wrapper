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
  SELL_ALL,
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY,
  ADDRESS_OF_TOKEN_TO_SELL,
  AMOUNT_OF_TOKEN_TO_SELL,
  SLIPPAGE,
);</code></pre>

<ul>
  <li><strong>SELL_ALL:</strong> Boolean to decide wether to sell all or not. Defaults to true</li>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to sell from.</li>
  <li><strong>ADDRESS_OF_TOKEN_TO_SELL:</strong> The address of the token you want to sell.</li>
  <li><strong>AMOUNT_OF_TOKEN_TO_SELL:</strong> The amount of tokens you want to sell. (Include if SELL_ALL is false)</li>
  <li><strong>SLIPPAGE:</strong> The slippage you want to use (default 1%).</li>
</ul>

<p>This function returns a promise that resolves to the transaction id of the sell operation.</p>
<p>For now it only allows to sell all the bag of that token</p>

<h3>Getting Account Tokens Balances</h3>

<pre><code>const tokens_balances = await get_tokens_balances(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to get the tokens from.</li>
</ul>
<p>This function returns a promise that resolves to an object mapping token addresses to their balance and symbol.</p>

<h3>Getting Token Balance</h3>

<pre><code>const token_balance = await get_token_balance(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY,
  TOKEN_ADDRESS
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to get the tokens from.</li>
  <li><strong>TOKEN_ADDRESS:</strong> The address of the token you want to get the balance from.</li>
</ul>
<p>This function returns a promise that resolves to the balance of the token.</p>

