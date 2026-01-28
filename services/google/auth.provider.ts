import { GOOGLE_WEB_CLIENT_ID } from "@env";
import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import type { ApiResponse, IGoogleAuthProvider } from "../../types";

export class GoogleAuthProvider implements IGoogleAuthProvider {
  private configured = false;

  async configure(): Promise<void> {
    if (this.configured) return;

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    this.configured = true;
  }

  async signIn(): Promise<ApiResponse<{ idToken: string }>> {
    try {
      await this.configure();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      if (!signInResult.data?.idToken) {
        return {
          data: null,
          error: {
            code: "NO_ID_TOKEN",
            message: "Google Sign-In succeeded but no ID token was returned",
          },
          success: false,
        };
      }

      return {
        data: { idToken: signInResult.data.idToken },
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as { code?: string; message?: string };

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          data: null,
          error: {
            code: "CANCELLED",
            message: "User cancelled the sign-in flow",
          },
          success: false,
        };
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        return {
          data: null,
          error: {
            code: "IN_PROGRESS",
            message: "Sign-in already in progress",
          },
          success: false,
        };
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          data: null,
          error: {
            code: "PLAY_SERVICES_UNAVAILABLE",
            message: "Play Services not available",
          },
          success: false,
        };
      }

      return {
        data: null,
        error: {
          code: "GOOGLE_SIGN_IN_ERROR",
          message: error.message ?? "Unknown error during Google Sign-In",
          details: error,
        },
        success: false,
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Silent fail on sign out
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      await this.configure();
      const currentUser = await GoogleSignin.getCurrentUser();
      return currentUser !== null;
    } catch {
      return false;
    }
  }
}

export const googleAuthProvider = new GoogleAuthProvider();
