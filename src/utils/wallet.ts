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

// New wallet functions for multi-user system
export async function getUserWallet(userId: string) {
  const res = await fetch(`http://localhost:8000/api/wallet-sync/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch wallet');
  return res.json();
}

export async function chargeSession(amount: number, studentId: string, teacherId: string, sessionId?: string) {
  const body: Record<string, unknown> = {
    amount: Number(amount),
    student_id: String(studentId),
    teacher_id: String(teacherId),
  };
  if (sessionId != null && sessionId !== '') {
    body.session_id = String(sessionId);
  }

  const res = await fetch('http://localhost:8000/api/wallet/charge-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorMessage = 'Charge failed';
    try {
      const err = await res.json();
      const detail = err.detail;
      if (Array.isArray(detail)) {
        errorMessage = detail.map((e: { msg?: string; loc?: unknown }) => e.msg || JSON.stringify(e)).join('; ');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (detail != null) {
        errorMessage = JSON.stringify(detail);
      }
    } catch (e) {
      errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
