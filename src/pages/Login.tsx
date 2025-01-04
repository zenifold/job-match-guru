import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/builder");
    }
  }, [session, navigate]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated light rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white/5 rotate-45 transform -translate-x-full animate-[slide-in-right_3s_ease-out_forwards]" />
          <div className="absolute top-1/4 -right-4 w-72 h-72 bg-white/5 rotate-45 transform translate-x-full animate-[slide-in-right_3s_ease-out_forwards_0.5s]" />
          <div className="absolute bottom-1/4 -left-4 w-72 h-72 bg-white/5 rotate-45 transform -translate-x-full animate-[slide-in-right_3s_ease-out_forwards_1s]" />
        </div>
        
        {/* Auth container */}
        <div className="relative z-10 max-w-md mx-auto pt-20 px-6">
          <div className="bg-black/30 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-white/10">
            <h1 className="text-2xl font-bold mb-6 text-center text-white">Sign In</h1>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#ffffff',
                      brandAccent: '#666666',
                      inputBackground: 'transparent',
                      inputText: '#ffffff',
                      inputPlaceholder: '#666666',
                      messageText: '#ffffff',
                      anchorTextColor: '#ffffff',
                      dividerBackground: '#666666',
                    },
                  },
                },
                className: {
                  container: 'text-white',
                  button: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
                  input: 'bg-black/20 border-white/20 text-white placeholder-white/50',
                }
              }}
              providers={[]}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;