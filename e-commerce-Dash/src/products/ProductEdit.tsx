import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ImageInput,
    ImageField,
    BooleanInput,
    required,
    useDefaultTitle,
    useEditContext,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import VariantsEditor from './VariantsEditor';
import SubcategoryInput from './SubcategoryInput';

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductEdit = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    return (
        <Edit
            title={<ProductTitle />}
            transform={(data: any) => {
                const { variants, colorImages, _categoryFilter, ...rest } = data;
                const result: any = { ...rest };
                if (variants) result.variants = variants;
                else delete result.variants;
                if (colorImages) result.colorImages = colorImages;
                else delete result.colorImages;
                return result;
            }}
        >
            <SimpleForm>
                <TextInput source="en_name" validate={required()} fullWidth label={translate("pos.products.form.name_en")} />
                <TextInput source="ar_name" fullWidth label={translate("pos.products.form.name_ar")} />
                <TextInput source="fr_name" fullWidth label={translate("pos.products.form.name_fr")} />
                <TextInput source="en_description" validate={required()} fullWidth multiline rows={3} label={translate("pos.products.form.description_en")} />
                <TextInput source="ar_description" fullWidth multiline rows={3} label={translate("pos.products.form.description_ar")} />
                <TextInput source="fr_description" fullWidth multiline rows={3} label={translate("pos.products.form.description_fr")} />
                <NumberInput source="price" validate={required()} min={1} fullWidth />
                <NumberInput source="discount" min={0} max={100} fullWidth label={translate("pos.products.form.discount_percent")} />

                <SubcategoryInput />

                <VariantsEditor />

                <Box sx={{ mb: 1, mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>{translate("pos.products.form.product_images")}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {translate("pos.products.form.upload_images_help_edit")}
                    </Typography>
                    <ImageInput source="images" label={translate("pos.products.form.choose_files")} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }} multiple>
                        <ImageField source="src" />
                    </ImageInput>
                </Box>

                <BooleanInput source="isActive" label={translate("pos.products.form.active")} />
            </SimpleForm>
        </Edit>
    );
};

export default ProductEdit;
