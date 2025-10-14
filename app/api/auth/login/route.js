import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-direct';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }
    
    console.log('Tentative de connexion:', email);
    
    const result = await authenticateUser(email, password);
    
    if (result.success) {
      console.log('Connexion réussie pour:', email);
      
      // Créer la réponse avec les cookies de session
      const response = NextResponse.json({
        user: result.user,
        session: result.session
      });
      
      // Définir le cookie de session
      response.cookies.set('sb-access-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 heures
      });
      
      return response;
    } else {
      console.log('Échec de connexion pour:', email, result.error);
      
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erreur API login:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
