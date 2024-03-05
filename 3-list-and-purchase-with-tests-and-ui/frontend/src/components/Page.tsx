import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <Box marginX={16} marginY={8}>
      {children}
    </Box>
  );
}
