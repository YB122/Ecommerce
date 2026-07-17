import * as React from 'react';
import { ReferenceField, ReferenceFieldProps, TextField, useTranslate } from 'react-admin';

interface Props {
    source?: string;
}

const ProductReferenceField = (
    props: Props &
        Omit<ReferenceFieldProps, 'source' | 'reference' | 'children'>
) => {
    const translate = useTranslate();
    return (
        <ReferenceField
            label={translate("pos.common.product")}
            source="product_id"
            reference="products"
            {...props}
        >
            <TextField source="reference" />
        </ReferenceField>
    );
};

export default ProductReferenceField;
