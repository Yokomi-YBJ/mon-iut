import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { ShieldCheck, LogIn } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { redirectTo } = await login(identifiant, password);
      navigate(redirectTo || '/admin');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Identifiant ou mot de passe incorrect. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-iut-bg px-4 py-12">
      <div className="w-full max-w-md bg-white border border-iut-border rounded-lg shadow-sm p-8">
        {/* En-tête avec logo officiel */}
        <div className="text-center mb-8">
          <img
            src={logoImg}
            alt="Logo IUT"
            className="w-16 h-16 mx-auto mb-3 object-contain rounded-full border border-gray-100"
          />
          <h1 className="text-2xl font-bold text-iut-blue">
            Mon <span className="text-iut-orange">IUT</span>
          </h1>
          <p className="text-xs text-iut-text-grey mt-1">
            Portail d'accès administratif et académique
          </p>
        </div>

        {error && (
          <Alert type="error" className="mb-6" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Identifiant / Email"
            id="identifiant"
            name="identifiant"
            type="text"
            placeholder="Ex : admin@iut.cm ou kani@gmail.com"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            required
            autoComplete="username"
          />

          <Input
            label="Mot de passe"
            id="password"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              icon={LogIn}
            >
              Se connecter
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-iut-text-grey">
            <ShieldCheck className="w-4 h-4 text-iut-orange" />
            <span>Connexion sécurisée avec chiffrement JWT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
