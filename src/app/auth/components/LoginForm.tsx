import type { SignInData } from '../types';

interface LoginFormProps {
  data: SignInData;
  onChange: (data: SignInData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function LoginForm({ data, onChange, onSubmit, isLoading }: LoginFormProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={data.username}
            onChange={(e) => onChange({ ...data, username: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? '...' : 'Đăng nhập'}
        </button>
      </form>
    </>
  );
}
