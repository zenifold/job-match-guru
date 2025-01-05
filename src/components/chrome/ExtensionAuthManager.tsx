import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

export const ExtensionAuthManager = () => {
  const session = useSession();

  useEffect(() => {
    const syncSessionWithExtension = async () => {
      if (session?.access_token) {
        // Send session token to extension
        try {
          const extensionId = 'YOUR_EXTENSION_ID'; // Replace with your extension ID
          chrome.runtime.sendMessage(extensionId, {
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