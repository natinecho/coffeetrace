"use client";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@/app/global.css";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

// import Provider from "./(DashboardLayout)/components/provider/Provider";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* SessionProvider accepts session, default to undefined if it's not passed */}

        {/* <Provider session={null}> */}
        <SessionProvider session={null}>
          <ThemeProvider theme={baselightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
          </SessionProvider>
        {/* </Provider> */}
      </body>
    </html>
  );
}


// "use client";

// interface ProviderProps {
//   children: ReactNode;
//   session: Session | null;
// }

// const Provider = ({ children, session }: ProviderProps) => {
//   return <SessionProvider session={session}>{children}</SessionProvider>;
// };

// export default Provider;
