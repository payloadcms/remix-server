import React from 'react';
import { SelectInput } from 'payload/components/forms';

export const Select = (props: React.ComponentProps<typeof SelectInput>) => {
    return <SelectInput {...props} />;
};
