import * as React from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import TableIcon from "@mui/icons-material/TableChart";
import GridIcon from "@mui/icons-material/GridView";

const storageKey = (resource: string) => `viewMode_${resource}`;

export const useViewMode = (resource: string) => {
  const [mode, setMode] = React.useState<"table" | "card">(() => {
    const saved = localStorage.getItem(storageKey(resource));
    return saved === "card" || saved === "table" ? saved : "table";
  });

  const setAndPersist = React.useCallback(
    (value: "table" | "card") => {
      setMode(value);
      localStorage.setItem(storageKey(resource), value);
    },
    [resource],
  );

  return [mode, setAndPersist] as const;
};

interface ViewToggleProps {
  resource: string;
  mode: "table" | "card";
  onChange: (mode: "table" | "card") => void;
}

const ViewToggle = ({ resource, mode, onChange }: ViewToggleProps) => (
  <ToggleButtonGroup
    value={mode}
    exclusive
    onChange={(_, val) => val && onChange(val)}
    size="small"
    sx={{ ml: 2 }}
  >
    <ToggleButton value="table">
      <TableIcon fontSize="small" />
    </ToggleButton>
    <ToggleButton value="card">
      <GridIcon fontSize="small" />
    </ToggleButton>
  </ToggleButtonGroup>
);

export default ViewToggle;
