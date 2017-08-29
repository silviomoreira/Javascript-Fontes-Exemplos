//================================================================//
// * Fonte na linguagem Javascript                                //
// * AUTOR: Silvio Moreira                                        //
// * OBJETIVO: Utilização prática do componente desenvolvido em   //
//           Javascript denominado “SideShow”. Implementa um Help //
//           interativo para explicar o funcionamento da inserção // 
//           de registros de Contas a Receber de um site          //
//================================================================//
Sideshow.registerWizard({
    name: "contas_a_receber_criacaonovoregistro",
    title: "Contas a Receber - Novo",
    description: "Aprenda a criar um novo vencimento de forma simplificada.",
    estimatedTime: "4 Minutos",
    affects: [
        function () {
            return ((url.indexOf("#/contaareceber")) > 0);
        }
    ]
}).storyLine({
    showStepPosition: true,
    steps: [
        {
            title: "Geração de novo Vencimento a Receber",
            text: "O sistema gera registros com Vencimentos a Receber. Continue os passos deste tutorial e aprenda mais com os nossos exemplos."
        },
        {
            title: "Iniciando",
            text: "É necessário gerar um novo registro inicialmente. Então, vamos à prática... Clique no botão \"Novo\".",
            targets: ".k-button.new",
            subject: ".k-button.new",
            arrowPosition: "left",
            autoContinue: true,
            completingConditions: [
                function() {
                    var url = location.href;
                    return (url.indexOf("#/contaareceber/novo") > 0);
                }
            ],
            listeners: {
                beforeStep: function () {
                },
                afterStep: function () {
                }
            }
        },
        {
            title: "Informando dados",
            text: "Clique no campo Cliente e selecione o cliente desejado na lista.",
            targets: "#Cliente_IdText",
            subject: "#Cliente_IdText"
        },
        {
            title: "Informando dados",
            text: "Clique no campo Unidade de Negócio e selecione a Unidade de Negócio desejada.",
            targets: "#UnidadeNegocio_IdText",
            subject: "#UnidadeNegocio_IdText"
        },
        {
            title: "Informando dados",
            text: "Digite a data desejada se for diferente da atual.",
            targets: ".k-header.date.k-input",
            subject: ".k-header.date.k-input"
        },
        {
            title: "Informando dados",
            text: "Selecione o serviço desejado.",
            targets: "#Servico_IdText",
            subject: "#Servico_IdText"
        },
        {
            title: "Informando dados",
            text: "Digite o Valor do serviço desejado.",
            targets: ".minicrud-single .Valor .money", 
            subject: ".minicrud-single .Valor .money"
        },
        {
            title: "Informando dados",
            text: "Digite todas as informações referentes a este recebimento no campo \"Anotação\". Informe principalmente a que se refere o valor a receber.",
            targets: "[name=Anotacao]",
            subject: "[name=Anotacao]"
        },

    ]
});

