import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AuthTestPage() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoginIdle,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
    loginError,
  } = useInternetIdentity();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Current Status</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={loginStatus === "success" ? "default" : "outline"}>
                Status: {loginStatus}
              </Badge>
              <Badge variant={isInitializing ? "default" : "outline"}>
                Initializing: {isInitializing ? "Yes" : "No"}
              </Badge>
              <Badge variant={isLoginIdle ? "default" : "outline"}>
                Idle: {isLoginIdle ? "Yes" : "No"}
              </Badge>
              <Badge variant={isLoggingIn ? "default" : "outline"}>
                Logging In: {isLoggingIn ? "Yes" : "No"}
              </Badge>
              <Badge variant={isLoginSuccess ? "default" : "outline"}>
                Success: {isLoginSuccess ? "Yes" : "No"}
              </Badge>
              <Badge variant={isLoginError ? "destructive" : "outline"}>
                Error: {isLoginError ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Environment</h3>
            <div className="bg-muted p-4 rounded-md text-sm font-mono space-y-1">
              <div>II_URL: {process.env.II_URL || "undefined"}</div>
              <div>DFX_NETWORK: {process.env.DFX_NETWORK || "undefined"}</div>
              <div>CANISTER_ID_BACKEND: {process.env.CANISTER_ID_BACKEND || "undefined"}</div>
            </div>
          </div>

          {/* Identity Info */}
          {identity && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Identity Info</h3>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Principal ID</AlertTitle>
                <AlertDescription className="font-mono text-xs break-all">
                  {identity.getPrincipal().toString()}
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Error Display */}
          {isLoginError && loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{loginError.message}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isLoginSuccess ? (
              <Button onClick={clear} variant="outline">
                Logout
              </Button>
            ) : (
              <Button onClick={login} disabled={isLoggingIn}>
                {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoggingIn ? "Logging in..." : "Login with Internet Identity"}
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
            <p className="font-semibold">Troubleshooting Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Check if II_URL environment variable is set correctly</li>
              <li>Ensure popup blockers are disabled</li>
              <li>Try clicking the login button</li>
              <li>Check browser console for any errors</li>
              <li>Verify you have a stable internet connection</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
