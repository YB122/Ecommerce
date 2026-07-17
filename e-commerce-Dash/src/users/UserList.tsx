import * as React from "react";
import { useState, useEffect } from "react";
import { Title, useDefaultTitle, useNotify, CreateButton, usePermissions, useTranslate } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getAuthHeaders, fetchWithRefresh } from "../auth";
import { useAuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3007/v1";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const appTitle = useDefaultTitle();
  const notify = useNotify();
  const { permissions } = usePermissions();
  const translate = useTranslate();

  useEffect(() => {
    fetchWithRefresh(`${API_URL}/user/profile`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((json) => {
        setUser(json.data);
        setPhone(json.data?.phone || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      if (phone) fd.append("phone", phone);
      if (imageFile) fd.append("image", imageFile);

      const res = await fetchWithRefresh(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: { ...getAuthHeaders() },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || translate("pos.users.notification.save_failed"));
      }

      const json = await res.json();
      setUser(json.data);
      setImageFile(null);
      setPreview(null);
      notify(translate("pos.users.notification.profile_updated"), { type: "success" });
    } catch (e: any) {
      notify(e.message, { type: "warning" });
    }
    setSaving(false);
  };

  if (loading) return null;

  const displayUrl = preview || user?.imageURL;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <title>{`${appTitle} - Profile`}</title>
      <Title title={translate("pos.users.title.profile")} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        {permissions === "superAdmin" && <CreateButton label="Create Admin" />}
      </Box>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar src={displayUrl} sx={{ width: 80, height: 80, mr: 2 }}>
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Button
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  minWidth: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                size="small"
              >
                <CameraAltIcon sx={{ fontSize: 16 }} />
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
            </Box>
            <Box>
              <Typography variant="h5">{user?.name}</Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
              <Chip
                label={user?.role}
                color={user?.role === "superAdmin" ? "error" : "primary"}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          <Box sx={{ borderTop: "1px solid #eee", pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label={translate("pos.common.phone")} value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, color: "text.secondary", fontSize: "0.9rem" }}>
              <Typography><strong>{translate("pos.users.info.email")}:</strong> {user?.email}</Typography>
              <Typography><strong>{translate("pos.users.info.role")}:</strong> {user?.role}</Typography>
              <Typography><strong>{translate("pos.users.info.active")}:</strong> {user?.isActive ? "Yes" : "No"}</Typography>
              <Typography><strong>{translate("pos.users.info.joined")}:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                {translate("pos.common.save")}
              </Button>
              {(imageFile || phone !== (user?.phone || "")) && (
                <Button variant="outlined" onClick={() => { setPhone(user?.phone || ""); setImageFile(null); setPreview(null); }}>
                  {translate("pos.common.cancel")}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
