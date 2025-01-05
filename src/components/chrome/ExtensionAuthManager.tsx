import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

declare global {
  interface Window {
    chrome?: {
      runtime: {
        sendMessage: (extensionId: string, message: any) => void;
      };
    }
  }
}

export const ExtensionAuthManager = () => {
  const session = useSession();

  useEffect(() => {
    const syncSessionWithExtension = async () => {
      if (session?.access_token && window.chrome?.runtime) {
        // Send session token to extension
        try {
          const extensionId = 'YOUR_EXTENSION_ID'; // Replace with your extension ID
          window.chrome.runtime.sendMessage(extensionId, {
            type: 'SET_SESSION',
            session: session.access_token
          });
        } catch (error) {
          console.error('Failed to sync session with extension:', error);
        }
      }
    };

    syncSessionWithExtension();
  }, [session]);

  return null; // This component doesn't render anything
};