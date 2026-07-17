import * as React from 'react';
import { SelectInput, useGetList, useDataProvider, useTranslate } from 'react-admin';
import { useWatch, useFormContext } from 'react-hook-form';

const SubcategoryInput = () => {
    const { setValue } = useFormContext();
    const translate = useTranslate();
    const categoryId = useWatch({ name: '_categoryFilter' });
    const subcategoryId = useWatch({ name: 'subcategoryId' });

    const { data: categories } = useGetList('categories', {
        pagination: { page: 1, perPage: 100 },
    });

    const catFilter = useCategoryFilter(subcategoryId, categoryId);

    React.useEffect(() => {
        if (catFilter && !categoryId) {
            setValue('_categoryFilter', catFilter);
        }
    }, [catFilter]);

    React.useEffect(() => {
        if (categoryId && subcategoryId) {
            setValue('subcategoryId', undefined);
        }
    }, [categoryId]);

    const { data: subcategories } = useGetList('subcategories', {
        pagination: { page: 1, perPage: 100 },
        filter: catFilter ? { categoryId: catFilter } : undefined,
    });

    const categoryChoices = React.useMemo(
        () => (categories || []).map((c: any) => ({ id: c.id, name: c.en_name })),
        [categories],
    );

    const catNameMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        (categories || []).forEach((c: any) => { map[c.id] = c.en_name; });
        return map;
    }, [categories]);

    const subcategoryChoices = React.useMemo(
        () =>
            (subcategories || []).map((s: any) => ({
                id: s.id,
                name: `${s.en_name} — ${catNameMap[s.categoryId] || ''}`,
            })),
        [subcategories, catNameMap],
    );

    return (
        <>
            <SelectInput source="_categoryFilter" label={translate("pos.products.form.category")} choices={categoryChoices} fullWidth />
            <SelectInput source="subcategoryId" label={translate("pos.products.form.subcategory")} choices={subcategoryChoices} fullWidth />
        </>
    );
};

const useCategoryFilter = (subcategoryId: string | undefined, categoryId: string | undefined) => {
    const dp = useDataProvider();
    const [filter, setFilter] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (categoryId) {
            setFilter(undefined);
            return;
        }
        if (!subcategoryId) return;
        let cancelled = false;
        dp.getOne('subcategories', { id: subcategoryId }).then(({ data }) => {
            if (!cancelled && data?.categoryId) setFilter(data.categoryId);
        }).catch(() => {});
        return () => { cancelled = true; };
    }, [subcategoryId, categoryId, dp]);

    return categoryId || filter;
};

export default SubcategoryInput;
