import { signIn, signUp, signInWithGoogle, signInWithGitHub } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  return (
    <main>
      <div className="card">
        <h1>Sign in to your todos</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="msg">{message}</p>}

        <form>
          <input name="email" type="email" placeholder="Email" required autoComplete="email" />
          <input name="password" type="password" placeholder="Password (min 6 chars)" required minLength={6} autoComplete="current-password" />
          <div className="row">
            <button className="primary" formAction={signIn}>Sign in</button>
            <button formAction={signUp}>Sign up</button>
          </div>
        </form>

        <div className="divider">or continue with</div>

        <div className="row">
          <form action={signInWithGoogle}><button style={{ width: '100%' }}>Google</button></form>
          <form action={signInWithGitHub}><button style={{ width: '100%' }}>GitHub</button></form>
        </div>
      </div>
    </main>
  )
}
