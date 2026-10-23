export const validarAtribuicaoEntrega = (req, res, next) => {
    const { id } = req.params;
    const { motoristaId } = req.body;

    if (motoristaId === undefined || motoristaId === null || motoristaId === '') {
        req.flash('erro', 'Selecione um motorista.');
        return res.redirect(`/entregas/${id}`);
    }

    const idNum = Number(motoristaId);
    if (!Number.isInteger(idNum) || idNum <= 0) {
        req.flash('erro', 'Motorista inválido.');
        return res.redirect(`/entregas/${id}`);
    }

    req.body.motoristaId = idNum;
    next();
};