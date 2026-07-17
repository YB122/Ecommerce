import * as React from "react";
import {
  List,
  EditButton,
  DeleteButton,
  ReferenceField,
  Pagination,
  RecordContextProvider,
  useDefaultTitle,
  useListContext,
  TopToolbar,
  CreateButton,
  SortButton,
  useRecordContext,
  useGetMany,
  useTranslate,
} from "react-admin";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  InputBase,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewToggle, { useViewMode } from "../components/ViewToggle";
import GroupDeleteButton from "./GroupDeleteButton";

const RESOURCE = "subcategories";

const SubcategoriesTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const ListActions = ({ mode, onModeChange }: { mode: "table" | "card"; onModeChange: (v: "table" | "card") => void }) => {
  const translate = useTranslate();
  const { setFilters, filterValues } = useListContext();
  const [search, setSearch] = React.useState(filterValues?.q || "");

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters(value ? { q: value } : {}, null);
  };

  return (
    <TopToolbar sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1, px: 1, py: 0.3, minWidth: 220 }}>
        <SearchIcon sx={{ color: "text.secondary", mr: 0.5, fontSize: 20 }} />
        <InputBase
          placeholder={translate("pos.subcategories.search")}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ flex: 1, fontSize: "0.875rem" }}
        />
      </Box>
      <SortButton fields={["en_name", "createdAt"]} />
      <CreateButton />
      <ViewToggle resource={RESOURCE} mode={mode} onChange={onModeChange} />
    </TopToolbar>
  );
};

const CategoryChip = () => {
  const record = useRecordContext();
  return record ? (
    <Chip label={record.en_name} size="small" variant="outlined" color="primary" />
  ) : null;
};

const SubcategoryGrid = () => {
  const { data, error, isPending } = useListContext();
  if (isPending) return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
          <Skeleton variant="rounded" sx={{ height: 160 }} />
        </Grid>
      ))}
    </Grid>
  );
  if (error) return null;
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {data.map((record) => (
        <RecordContextProvider key={record.id} value={record}>
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Card>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, paddingBottom: "0.5em" }}>
                <Typography variant="h6" component="h2" align="center">
                  {record.en_name}
                </Typography>
                <ReferenceField source="categoryId" reference="categories" link="show">
                  <CategoryChip />
                </ReferenceField>
                {record.ar_name && (
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                  >
                    {record.ar_name} / {record.fr_name}
                  </Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <EditButton />
                <DeleteButton />
              </CardActions>
            </Card>
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
};

const GroupedTable = () => {
  const translate = useTranslate();
  const { data, error, isPending } = useListContext();
  if (isPending) return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{translate("pos.subcategories.columns.name_en")}</TableCell>
          <TableCell>{translate("pos.subcategories.columns.name_ar_fr")}</TableCell>
          <TableCell>{translate("pos.subcategories.columns.categories")}</TableCell>
          <TableCell align="center">{translate("pos.subcategories.columns.status")}</TableCell>
          <TableCell align="center">{translate("pos.subcategories.columns.actions")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton variant="text" sx={{ width: 120 }} /></TableCell>
            <TableCell><Skeleton variant="text" sx={{ width: 100 }} /></TableCell>
            <TableCell><Box sx={{ display: "flex", gap: 0.5 }}><Skeleton variant="rounded" sx={{ width: 60, height: 24 }} /><Skeleton variant="rounded" sx={{ width: 50, height: 24 }} /></Box></TableCell>
            <TableCell align="center"><Skeleton variant="rounded" sx={{ width: 60, height: 24, mx: "auto" }} /></TableCell>
            <TableCell align="center"><Skeleton variant="rounded" sx={{ width: 80, height: 30, mx: "auto" }} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  if (error) return null;

  const grouped = React.useMemo(() => {
    const map = new Map<string, { en_name: string; ar_name: string; fr_name: string; categoryIds: string[]; ids: string[]; allActive: boolean; someActive: boolean }>();
    data.forEach((r: any) => {
      if (!map.has(r.en_name)) {
        map.set(r.en_name, { en_name: r.en_name, ar_name: r.ar_name, fr_name: r.fr_name, categoryIds: [], ids: [], allActive: true, someActive: false });
      }
      const entry = map.get(r.en_name)!;
      if (!entry.categoryIds.includes(r.categoryId)) {
        entry.categoryIds.push(r.categoryId);
      }
      entry.ids.push(r.id);
      if (r.isActive) entry.someActive = true;
      else entry.allActive = false;
    });
    return Array.from(map.values());
  }, [data]);

  const allCategoryIds = React.useMemo(() => {
    const ids = new Set<string>();
    grouped.forEach(g => g.categoryIds.forEach(c => ids.add(c)));
    return Array.from(ids);
  }, [grouped]);

  const { data: categories } = useGetMany("categories", { ids: allCategoryIds });
  const catMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (categories || []).forEach((c: any) => m.set(c.id, c.en_name));
    return m;
  }, [categories]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{translate("pos.subcategories.columns.name_en")}</TableCell>
          <TableCell>{translate("pos.subcategories.columns.name_ar_fr")}</TableCell>
          <TableCell>{translate("pos.subcategories.columns.categories")}</TableCell>
          <TableCell align="center">{translate("pos.subcategories.columns.status")}</TableCell>
          <TableCell align="center">{translate("pos.subcategories.columns.actions")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {grouped.map((g) => (
          <TableRow key={g.en_name}>
            <TableCell sx={{ fontWeight: 600 }}>{g.en_name} {g.ids.length > 1 && <Chip label={`×${g.ids.length}`} size="small" sx={{ ml: 1 }} />}</TableCell>
            <TableCell>{g.ar_name} / {g.fr_name}</TableCell>
            <TableCell>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {g.categoryIds.map(cid => (
                  <Chip key={cid} label={catMap.get(cid) || cid} size="small" variant="outlined" color="primary" />
                ))}
              </Box>
            </TableCell>
            <TableCell align="center">
              {g.allActive ? (
                <Chip label={translate("pos.subcategories.status.active")} size="small" color="success" />
              ) : g.someActive ? (
                <Chip label={translate("pos.subcategories.status.mixed")} size="small" color="warning" />
              ) : (
                <Chip label={translate("pos.subcategories.status.inactive")} size="small" color="error" />
              )}
            </TableCell>
            <TableCell align="center">
              <RecordContextProvider value={{ id: g.ids[0] }}>
                <EditButton />
                <GroupDeleteButton ids={g.ids} allActive={g.allActive} someActive={g.someActive} />
              </RecordContextProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const SubcategoryPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50]} />;

const SubcategoryList = () => {
  const [mode, setMode] = useViewMode(RESOURCE);
  return (
    <List
      sort={{ field: "en_name", order: "ASC" }}
      perPage={500}
      pagination={mode === "card" ? <SubcategoryPagination /> : false}
      component={mode === "card" ? "div" : undefined}
      title={<SubcategoriesTitle />}
      actions={<ListActions mode={mode} onModeChange={setMode} />}
    >
      {mode === "card" ? <SubcategoryGrid /> : <GroupedTable />}
    </List>
  );
};

export default SubcategoryList;
