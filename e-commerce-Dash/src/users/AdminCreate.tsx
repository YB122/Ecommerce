import * as React from "react";
import { useState } from "react";
import { Title, useDefaultTitle, useNotify, useTranslate } from "react-admin";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchWithRefresh, getAuthHeaders } from "../auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3007/v1";

const AdminCreate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const appTitle = useDefaultTitle();
  const notify = useNotify();
  const translate = useTranslate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return notify(translate("pos.users.notification.email_required"), { type: "warning" });
    if (password.length < 6) return notify(translate("pos.users.notification.password_min"), { type: "warning" });
    if (password !== confirmPassword) return notify(translate("pos.users.notification.password_mismatch"), { type: "warning" });

    setSaving(true);
    try {
      const res = await fetchWithRefresh(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ email, password, confirmPassword, phone: phone || undefined, role: "admin" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create admin");
      }

      notify("Admin created", { type: "success" });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
    } catch (e: any) {
      notify(e.message, { type: "warning" });
    }
    setSaving(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <title>{`${appTitle} - Create Admin`}</title>
      <Title title="Create Admin" />
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label={translate("pos.users.form.email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required size="small" />
            <TextField label={translate("pos.users.form.password")} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required size="small" inputProps={{ minLength: 6 }} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
            <TextField label={translate("pos.users.form.confirm_password")} type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required size="small" slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
            <TextField label={translate("pos.users.form.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" />
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                Create Admin
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminCreate;
