import { useCatalogoSearch } from './catalogoSearchHook';
import { useCatalogoDetalle } from './catalogoDetallHook';

export const useCatalogoLogic = () => {
    const search = useCatalogoSearch();
    const detalle = useCatalogoDetalle();

    return {
        ...search,
        ...detalle,
    };
};