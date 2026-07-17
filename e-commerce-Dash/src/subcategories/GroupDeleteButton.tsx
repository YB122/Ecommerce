import * as React from "react";
import { useState } from "react";
import { useUpdateMany, useRefresh, useNotify, useUnselectAll, useTranslate } from "react-admin";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";

interface Props {
  ids: string[];
  allActive: boolean;
  someActive: boolean;
}

const GroupDeleteButton = ({ ids, allActive, someActive }: Props) => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const refresh = useRefresh();
  const notify = useNotify();
  const unselectAll = useUnselectAll("subcategories");

  const isFullyInactive = !allActive && !someActive;
  const shouldRestore = isFullyInactive;
  const label = shouldRestore ? translate("pos.common.restore") : translate("pos.common.delete");
  const activeValue = shouldRestore;

  const [updateMany] = useUpdateMany();

  const handleClick = () => setOpen(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateMany("subcategories", { ids, data: { isActive: activeValue } });
      unselectAll();
      refresh();
      notify(shouldRestore ? translate("pos.subcategories.notification.restored") : translate("pos.subcategories.notification.deleted"), { type: "success" });
    } catch (e: any) {
      notify(e.message, { type: "warning" });
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        color={shouldRestore ? "success" : "error"}
        onClick={handleClick}
        startIcon={shouldRestore ? <UndoIcon /> : <DeleteIcon />}
      >
        {loading ? <CircularProgress size={14} /> : label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{label} {ids.length} subcategories</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {label} {ids.length} subcategories
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>{translate("pos.common.cancel")}</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={18} /> : translate("pos.common.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupDeleteButton;
