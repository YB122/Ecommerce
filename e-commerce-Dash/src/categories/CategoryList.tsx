import * as React from "react";
import {
  EditButton,
  List,
  RecordContextProvider,
  useDefaultTitle,
  useListContext,
  useTranslate,
  TextField,
  BooleanField,
  Datagrid,
  TopToolbar,
  CreateButton,
  SortButton,
} from "react-admin";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import ViewToggle, { useViewMode } from "../components/ViewToggle";

const RESOURCE = "categories";

const CategoriesTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const ListActions = ({ mode, onModeChange }: { mode: "table" | "card"; onModeChange: (v: "table" | "card") => void }) => (
  <TopToolbar>
    <SortButton fields={["en_name", "createdAt"]} />
    <CreateButton />
    <ViewToggle resource={RESOURCE} mode={mode} onChange={onModeChange} />
  </TopToolbar>
);

const CategoryGrid = () => {
  const { data, error, isPending } = useListContext();
  if (isPending) return null;
  if (error) return null;
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {data.map((record) => (
        <RecordContextProvider key={record.id} value={record}>
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Card>
              <CardMedia
                image={
                  record.imageURL ||
                  "https://via.placeholder.com/300x140?text=No+Image"
                }
                sx={{ height: 140, backgroundSize: "cover" }}
              />
              <CardContent sx={{ paddingBottom: "0.5em" }}>
                <Typography variant="h5" component="h2" align="center">
                  {record.en_name}
                </Typography>
                {record.ar_name && (
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                  >
                    {record.ar_name}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <EditButton />
              </CardActions>
            </Card>
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
};

const CategoryTable = () => {
  const translate = useTranslate();
  return (
    <Datagrid rowClick="edit">
      <TextField source="en_name" label={translate("pos.categories.columns.name_en")} />
      <TextField source="ar_name" label={translate("pos.categories.columns.name_ar")} />
      <TextField source="fr_name" label={translate("pos.categories.columns.name_fr")} />
      <BooleanField source="isActive" label={translate("pos.categories.columns.active")} />
      <EditButton />
    </Datagrid>
  );
};

const CategoryList = () => {
  const [mode, setMode] = useViewMode(RESOURCE);
  return (
    <List
      sort={{ field: "createdAt", order: "DESC" }}
      perPage={20}
      pagination={false}
      component="div"
      actions={<ListActions mode={mode} onModeChange={setMode} />}
      title={<CategoriesTitle />}
    >
      {mode === "card" ? <CategoryGrid /> : <CategoryTable />}
    </List>
  );
};

export default CategoryList;
