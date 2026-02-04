export async function getWallets() {
  const res = await fetch('http://127.0.0.1:8000/wallets');
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return res.json();
}

export async function chargeWallet(amount: number) {
  const res = await fetch('http://127.0.0.1:8000/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Charge failed');
  }

  return res.json();
}
