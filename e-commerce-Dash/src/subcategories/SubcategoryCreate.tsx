import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    required,
    useRedirect,
    useNotify,
    useCreate,
    useGetList,
    useTranslate,
} from 'react-admin';
import {
    FormControlLabel,
    Checkbox,
    FormGroup,
    FormLabel,
    Box,
    Button,
    CircularProgress,
} from '@mui/material';

const CategoryCheckboxGroup = ({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) => {
    const translate = useTranslate();
    const { data, isPending } = useGetList('categories', { pagination: { page: 1, perPage: 100 } });
    if (isPending) return <CircularProgress size={20} />;
    return (
        <Box sx={{ mb: 2 }}>
            <FormLabel sx={{ display: 'block', mb: 1, fontWeight: 500 }}>{translate("pos.common.category")}</FormLabel>
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

const SubcategoryCreate = () => {
    const translate = useTranslate();
    const redirect = useRedirect();
    const notify = useNotify();
    const [create] = useCreate();
    const [saving, setSaving] = React.useState(false);
    const [enName, setEnName] = React.useState('');
    const [arName, setArName] = React.useState('');
    const [frName, setFrName] = React.useState('');
    const [categoryIds, setCategoryIds] = React.useState<string[]>([]);

    const handleSave = async () => {
        if (!enName.trim()) return notify(translate("pos.subcategories.notification.en_name_required"), { type: 'warning' });
        if (categoryIds.length === 0) return notify(translate("pos.subcategories.notification.category_required"), { type: 'warning' });

        setSaving(true);
        let successCount = 0;
        for (const cid of categoryIds) {
            try {
                await create('subcategories', {
                    data: { en_name: enName, ar_name: arName, fr_name: frName, categoryId: cid },
                });
                successCount++;
            } catch {
                notify(translate("pos.subcategories.notification.create_failed") + " " + cid, { type: 'warning' });
            }
        }
        setSaving(false);

        if (successCount > 0) {
            notify(translate("pos.subcategories.notification.created"), { type: 'success' });
            setEnName('');
            setArName('');
            setFrName('');
            setCategoryIds([]);
        }
    };

    return (
        <Create redirect={false}>
            <SimpleForm toolbar={false}>
                <TextInput source="en_name" validate={required()} fullWidth onChange={(e: any) => setEnName(e.target.value)} />
                <TextInput source="ar_name" fullWidth onChange={(e: any) => setArName(e.target.value)} />
                <TextInput source="fr_name" fullWidth onChange={(e: any) => setFrName(e.target.value)} />
                <CategoryCheckboxGroup value={categoryIds} onChange={setCategoryIds} />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        {translate("pos.common.save")}
                    </Button>
                    <Button variant="outlined" onClick={() => redirect('/subcategories')}>
                        {translate("pos.common.cancel")}
                    </Button>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default SubcategoryCreate;
