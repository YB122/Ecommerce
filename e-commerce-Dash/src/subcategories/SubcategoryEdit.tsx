import * as React from 'react';
import {
    Edit,
    useEditContext,
    useGetList,
    useUpdate,
    useUpdateMany,
    useCreate,
    useDelete,
    useNotify,
    useRedirect,
    SimpleForm,
    TextInput,
    required,
    useTranslate,
} from 'react-admin';
import {
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormLabel,
} from '@mui/material';

const CategoryCheckboxGroup = ({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) => {
    const translate = useTranslate();
    const { data, isPending } = useGetList('categories', { pagination: { page: 1, perPage: 100 } });
    if (isPending) return <CircularProgress size={20} />;
    return (
        <Box sx={{ mb: 2 }}>
            <FormLabel sx={{ display: 'block', mb: 1, fontWeight: 500 }}>{translate("pos.subcategories.form.categories")}</FormLabel>
            <FormGroup row>
                {(data || []).map((cat: any) => (
                    <FormControlLabel
                        key={cat.id}
                        control={
                            <Checkbox
                                checked={value.includes(cat.id)}
                                onChange={(_, checked) =>
                                    onChange(checked ? [...value, cat.id] : value.filter((id) => id !== cat.id))
                                }
                            />
                        }
                        label={cat.en_name}
                    />
                ))}
            </FormGroup>
        </Box>
    );
};

const SubcategoryEditForm = () => {
    const translate = useTranslate();
    const { record, isLoading: recordLoading } = useEditContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const [update] = useUpdate();
    const [updateMany] = useUpdateMany();
    const [create] = useCreate();
    const [del] = useDelete();

    const [enName, setEnName] = React.useState('');
    const [arName, setArName] = React.useState('');
    const [frName, setFrName] = React.useState('');
    const [categoryIds, setCategoryIds] = React.useState<string[]>([]);
    const [isActive, setIsActive] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    const enNameValue = record?.en_name || '';

    const { data: siblings, isPending: siblingsLoading } = useGetList('subcategories', {
        pagination: { page: 1, perPage: 100 },
        filter: { en_name: enNameValue },
    });

    React.useEffect(() => {
        if (!record) return;
        setEnName(record.en_name || '');
        setArName(record.ar_name || '');
        setFrName(record.fr_name || '');
        setIsActive(record.isActive ?? true);
    }, [record]);

    React.useEffect(() => {
        if (!siblings) return;
        setCategoryIds(siblings.map((s: any) => s.categoryId).filter(Boolean));
    }, [siblings]);

    if (recordLoading || siblingsLoading) return <CircularProgress />;

    const handleSave = async () => {
        if (!enName.trim()) return notify(translate("pos.subcategories.notification.en_name_required"), { type: 'warning' });
        if (categoryIds.length === 0) return notify(translate("pos.subcategories.notification.category_required"), { type: 'warning' });

        setSaving(true);

        const existingIds = (siblings || []).map((s: any) => ({ id: s.id, cid: s.categoryId }));

        const toCreate = categoryIds.filter((cid) => !existingIds.find((e) => e.cid === cid));
        const toDelete = existingIds.filter((e) => !categoryIds.includes(e.cid));

        try {
            await update('subcategories', { id: record.id, data: { en_name: enName, ar_name: arName || null, fr_name: frName || null, isActive } });

            const siblingIds = (siblings || []).map((s: any) => s.id).filter((id: string) => id !== record.id);
            if (siblingIds.length > 0) {
                await updateMany('subcategories', { ids: siblingIds, data: { isActive } });
            }

            for (const cid of toCreate) {
                await create('subcategories', { data: { en_name: enName, ar_name: arName || null, fr_name: frName || null, categoryId: cid, isActive } });
            }
            for (const item of toDelete) {
                await del('subcategories', { id: item.id });
            }

            notify(translate("pos.subcategories.notification.updated"), { type: 'success' });
            redirect('/subcategories');
        } catch {
            notify(translate("pos.subcategories.notification.save_failed"), { type: 'warning' });
        }
        setSaving(false);
    };

    return (
        <>
            <TextInput source="en_name" validate={required()} fullWidth onChange={(e: any) => setEnName(e.target.value)} />
            <TextInput source="ar_name" fullWidth onChange={(e: any) => setArName(e.target.value)} />
            <TextInput source="fr_name" fullWidth onChange={(e: any) => setFrName(e.target.value)} />
            <CategoryCheckboxGroup value={categoryIds} onChange={setCategoryIds} />
            <FormControlLabel
                control={<Checkbox checked={isActive} onChange={(_, c) => setIsActive(c)} />}
                label={translate("pos.subcategories.form.active")}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                    {translate("pos.common.save")}
                </Button>
                <Button variant="outlined" onClick={() => redirect('/subcategories')}>{translate("pos.common.cancel")}</Button>
            </Box>
        </>
    );
};

const SubcategoryEdit = () => (
    <Edit>
        <SimpleForm toolbar={false}>
            <SubcategoryEditForm />
        </SimpleForm>
    </Edit>
);

export default SubcategoryEdit;
