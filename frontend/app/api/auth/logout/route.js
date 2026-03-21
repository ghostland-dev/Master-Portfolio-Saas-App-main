import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Déconnexion utilisateur');
    
    const response = NextResponse.json({
      message: 'Déconnexion réussie'
    });
    
    // Supprimer le cookie de session
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    console.error('Erreur API logout:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
