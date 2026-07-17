import * as React from 'react';
import { Box } from '@mui/material';
import {
    CreateButton,
    ListBase,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    SortButton,
    Title,
    TopToolbar,
    useDefaultTitle,
    useListContext,
    NumberField,
    Datagrid,
    TextField,
    EditButton,
    BooleanField,
    FunctionField,
    ReferenceField,
    useTranslate,
} from 'react-admin';

const ProductList = () => {
    const translate = useTranslate();
    return (
        <ListBase perPage={24} sort={{ field: 'createdAt', order: 'DESC' }}>
            <ProductTitle />
            <ListActions />
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '100%' }}>
                    <Datagrid rowClick="edit" bulkActionButtons={false}>
                        <FunctionField
                            label={translate("pos.products.columns.image")}
                            render={record => {
                                let urls: string[] = [];
                                if (record.imageURLs) {
                                    try {
                                        urls = typeof record.imageURLs === 'string' ? JSON.parse(record.imageURLs) : record.imageURLs;
                                    } catch { /* ignore */ }
                                }
                                return urls.length > 0 ? (
                                    <img
                                        src={urls[0]}
                                        alt=""
                                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                ) : null;
                            }}
                        />
                        <TextField source="en_name" label={translate("pos.products.columns.name")} />
                        <NumberField source="price" options={{ style: 'currency', currency: 'EGP' }} />
                        <FunctionField label={translate("pos.products.columns.discount")} render={record => `${record.discount ?? 0}%`} />
                        <ReferenceField source="subcategoryId" reference="subcategories" link="show">
                            <TextField source="en_name" />
                        </ReferenceField>
                        <BooleanField source="isActive" label={translate("pos.products.columns.active")} />
                        <EditButton />
                    </Datagrid>
                    <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
                </Box>
            </Box>
        </ListBase>
    );
};

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <Title defaultTitle={defaultTitle} />
        </>
    );
};

export const productFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput
        source="subcategoryId"
        reference="subcategories"
        sort={{ field: 'en_name', order: 'ASC' }}
    >
        <SelectInput optionText="en_name" />
    </ReferenceInput>,
];

const ListActions = () => (
    <TopToolbar>
        <SortButton fields={['en_name', 'price', 'createdAt']} />
        <CreateButton />
    </TopToolbar>
);

export default ProductList;
