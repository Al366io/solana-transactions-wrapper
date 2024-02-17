<h1>solana-transactions-wrapper</h1>

<p>Handy tool to execute buy/sell transactions on the SOLANA chain.</p>

<h2>Installation</h2>

<p>Install the package with npm:</p>

<pre><code>npm install solana-transactions-wrapper</code></pre>

<h2>Usage</h2>

<h3>Importing the package</h3>

<pre><code>import { buy_token, sell_token, get_tokens_balances, get_token_balance } from 'solana-transactions-wrapper';</code></pre>
<hr>
<h2>Buying a token</h2>
<h4> Parameters: </h4>
<ul>
  <strong>config:</strong> The buy function accepts a config object, as per buyConfig object type.
  <p>The buyConfig object type is defined as follows:</p>
  <pre><code>type buyConfig = {
    RPC_ENDPOINT: string;
    WALLET_PRIVATE_KEY: string;
    ADDRESS_OF_TOKEN_TO_BUY: string;
    AMOUNT_OF_SOLANA_TO_SPEND: number;
    SLIPPAGE: number;
  }</code></pre>
</ul>
<h4> Usage: </h4>
<pre><code>await buy_token(config: buyConfig)</code></pre>
<h4> Logs Example: </h4>
<pre>Connection established 🚀
Wallet fetched ✅
Trying to buy token using "amount" SOL...
Transaction sent with txid: "transaction_id"
Waiting for confirmation... 🕒
Transaction confirmed ✅</pre>
<hr>
<h2>Selling a token</h2>
<h4> Parameters: </h4>
<ul>
  <strong>config:</strong> The sell function accepts a config object, as per sellConfig object type.
  <p>The sellConfig object type is defined as follows:</p>
  <pre><code>type sellConfig = {
    SELL_ALL: boolean;
    RPC_ENDPOINT: string;
    WALLET_PRIVATE_KEY: string;
    ADDRESS_OF_TOKEN_TO_SELL: string;
    AMOUNT_OF_TOKEN_TO_SELL?: number;
    SLIPPAGE: number;
  }</code></pre>
</ul>
<h4> Usage: </h4>
<pre><code>await sell_token(config: sellConfig)</code></pre>
<h4> Logs Example: </h4>
<pre>Connection established 🚀
Wallet fetched ✅
Selling "amount" of "token_address"...
Transaction sent with txid: "transaction_id"
Waiting for confirmation... 🕒
Transaction confirmed ✅</pre>

<hr>
<h2>Getting Account Tokens Balances</h2>

<pre><code>const tokens_balances = await get_tokens_balances(
  RPC_ENDPOINT,
  WALLET_PRIVATE_KEY
);</code></pre>

<ul>
  <li><strong>RPC_ENDPOINT:</strong> Your RPC endpoint to connect to.</li>
  <li><strong>WALLET_PRIVATE_KEY:</strong> The private key of the wallet you want to get the tokens from.</li>
</ul>
<p>This function returns a promise that resolves to an object mapping token addresses to their balance and symbol.</p>

<hr>
<h2>Getting Token Balance</h2>

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

