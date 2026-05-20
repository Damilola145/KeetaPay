/**
 * Keeta Network SDK utilities.
 * Uses @keetanetwork/keetanet-client with the builder pattern.
 * Sender must supply their account seed — no private keys are ever sent to any server.
 */

import * as KeetaNet from "@keetanetwork/keetanet-client";

export { KeetaNet };

export function isValidKeetaAddress(address) {
  if (!address || typeof address !== "string") return false;
  return address.startsWith("keeta_") && address.length > 20;
}

export function shortenAddress(address) {
  if (!address) return "";
  if (address.length <= 20) return address;
  return `${address.slice(0, 12)}...${address.slice(-8)}`;
}

export function generateLinkId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getPayUrl(link) {
  if (!link) return "";
  const origin = typeof window !== 'undefined' ? window.location.origin : "";
  const params = new URLSearchParams();
  if (link.link_id) params.set("id", link.link_id);
  if (link.recipient_address) params.set("to", link.recipient_address);
  if (link.amount) params.set("amount", link.amount);
  if (link.token) params.set("token", link.token);
  if (link.label) params.set("label", link.label);
  if (link.memo) params.set("memo", link.memo);
  if (link.network) params.set("network", link.network);
  return `${origin}/pay?${params.toString()}`;
}

/**
 * Derive sender's public address from their seed (index 0).
 */
export function getAddressFromSeed(seed) {
  const account = KeetaNet.lib.Account.fromSeed(seed.trim(), 0);
  return account.publicKeyString.toString();
}

/**
 * Send tokens using the KeetaNet SDK builder pattern.
 * @param {object} params
 * @param {string} params.seed        - Sender's account seed
 * @param {string} params.to          - Recipient keeta_ address
 * @param {string|number} params.amount - Amount in KTA (will be converted to BigInt)
 * @param {string} [params.network]   - 'test' | 'mainnet' (default 'test')
 * @returns {Promise<object>}          - Published builder result
 */
export async function sendPayment({ seed, to, amount, network = "test" }) {
  if (!seed) throw new Error("Sender seed is required to sign the transaction.");
  if (!isValidKeetaAddress(to)) throw new Error("Invalid recipient address.");
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) throw new Error("Invalid amount.");

  const sender = KeetaNet.lib.Account.fromSeed(seed.trim(), 0);
  const client = KeetaNet.UserClient.fromNetwork(network === "mainnet" ? "main" : "test", sender);

  const recipient = KeetaNet.lib.Account.fromPublicKeyString(to);

  // Convert decimal KTA amount to BigInt base units (nanoKTA, 9 decimals: 1 KTA = 1,000,000,000 base units)
  const amountBigInt = BigInt(Math.round(Number(amount) * 1_000_000_000));

  const builder = client.initBuilder();
  builder.send(recipient, amountBigInt, client.baseToken);

  await client.computeBuilderBlocks(builder);
  const result = await client.publishBuilder(builder);

  return result;
}