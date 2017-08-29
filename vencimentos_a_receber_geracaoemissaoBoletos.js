//================================================================//
// * Fonte na linguagem Javascript                                //
// * AUTOR: Silvio Moreira                                        //
// * OBJETIVO: Utilização prática do componente desenvolvido em   //
//           Javascript denominado “SideShow”. Implementa um Help //
//           interativo para explicar o funcionamento da emissão  // 
//           de boletos de Contas a Receber de um site            //
//================================================================//
var $bRetorno = false;

function openMenuStatusItem() {
    $(".filter-panelx-fields .Status .k-state-default").click();

    setTimeout(function () {
        $(".sideshow-xdetails-panel").css("height", "0px");
    }, 2000);
}

function setClickCheckbox(tipoDeCheckbox) {
    $(document).ready(function () {
        $(tipoDeCheckbox).click(function () {
            if ($(tipoDeCheckbox).is(':checked')) {
                $bRetorno = true;
            } else {
                $bRetorno = false;
            }
        });
    });
}

function setClickEmFiltros(seletorBt) {
    $(document).ready(function () {
        $(seletorBt).click(function () {
            Sideshow.gotoStep(3);
        });
    });
}

function setClickBtEmitirBoleto(seletorBt) {
    $(document).ready(function () {
        $(seletorBt).click(function () {
            Sideshow.close();
        });
    });
}


function retornaRegistrosOriginais() {
    var areaGrid = ko.dataFor($('.crudFilter')[0]);
    var grid = areaGrid.nlgrid();
    grid.url("vencimentosreceber/filtrartodosvencimentosemaberto");
}

function anulaFiltros() {
    var filter = ko.dataFor($(".filtros")[0]).filter();
    filter.Status(null);
    filter.aplicaFiltro();
}

Sideshow.registerWizard({
    name: "vencimentos_a_receber_geracaoemissaoBoletos",
    title: "Vencimentos a Receber - Geração(Emissão) de Boletos",
    description: "Aprenda a emitir boletos de maneira simples.",
    estimatedTime: "1 minuto",
    affects: [
        function () {
            var urlPrincipal = location.href;
            // elegibilidade apenas se tiver títulos abertos
            var url = "/VencimentosReceber/FiltrartodosVencimentosEmAberto?Status=2";
            var nRegistros = 0;

            var request = new nlib.Ajax.Request()
                .for(url)
                .synchronous()
                .sendingJson()
                .expectingJson()
                .onBadRequest(function (response) {
                    N.notification.errorAlert("Erro ao tentar iniciar o tutorial.");
                    console.error(response);
                })
                .onForbidden(function (httpResponse) {
                    httpResponse.status = 200;
                    N.notification.errorAlert("Sem permissão para testar a elegibilidade.");
                })
                .onSuccess(function (response) {
                    if (response)
                        nRegistros = response.Total;
                }).get();

            return ((urlPrincipal.indexOf("#/vencimentosreceber")) > 0 && (nRegistros > 0));
        }
    ],
    listeners: {
        beforeWizardStarts: function () {
            // Fecha área de filtros e anula-os
            if ($("#TipoDeDocumento_IdText").is(':visible')) {
                $(".crudFilter .filtros:visible .filter-panelx-title").click();
            }
            anulaFiltros();
        },
        afterWizardEnds: function () {
            retornaRegistrosOriginais();
            anulaFiltros();
        }
    }
}).storyLine({
    showStepPosition: true,
    steps: [
        {
            title: "Emissão/Geração de Boleto(s)",
            text: "É possível emitir um boleto para cada Vencimento a Receber. Continue os passos do tutorial e aprenda com os nossos exemplos."
        },
        {
            title: "Filtro",
            text: "O sistema só permite a geração de boleto para vencimentos que estejam com o status \"Em Aberto\". " +
                  "Então vamos filtrar os vencimentos com um simples clique no botão de \"Filtros\".",
            targets: ".crudFilter .filtros:visible .filter-panelx-title",
            subject: ".crudFilter .filtros:visible .filter-panelx-title",
            autoContinue: false,
            completingConditions: [
                function () {
                    // se clicar em "Filtros" passa automaticamente para o próximo passo
                    setClickEmFiltros(".crudFilter .filtros:visible .filter-panelx-title");
                    return true;
                }
            ],
            listeners: {
                beforestep: function() {
                    $(document).ready(function() {
                        setTimeout(function() {
                            $.scroll(0, { duration: 'fast' });
                        }, 1000);
                    });
                },
                afterStep: function () {
                    // clica em "Filtros"
                    if (!$("#TipoDeDocumento_IdText").is(':visible')) {
                        $(".crudFilter .filtros:visible .filter-panelx-title").click();
                    }
                }
            }
        },
        {
            title: "Filtro",
            text: "No campo \"Status\" selecione a opção \"Abertos\". ",
            targets: ".filter-panelx-fields .Status .k-state-default",
            subject: ".filter-panelx-fields .NLForm:visible",
            listeners: {
                beforeStep: function () {
                    openMenuStatusItem();
                },
                afterStep: function () {
                    $(".filter-panelx-fields .Status .k-state-default").click();
                    $(".km-popup .k-list-scontainer .k-list > li:nth-child(4)").click();
                }
            }
        },
        {
            title: "Filtro",
            text: "Vamos aplicar o filtro nos permitindo ver na grade somente os vencimentos \"Em Aberto\". Clique em \"Aplicar\". ",
            targets: ".NLForm .aplicar",
            subject: ".NLForm .aplicar",
            listeners: {
                afterStep: function () {
                    var areaGrid = ko.dataFor($('.crudFilter')[0]);
                    var grid = areaGrid.nlgrid();
                    grid.url("vencimentosreceber/vencimentosareceberquepossibilitamemitirboleto");
                    var now = new Date();
                    ko.dataFor($(".filtros")[0]).filter().startDate(now - 3000);
                    $(".NLForm .aplicar").click();
                }
            }
        },
        {
            title: "Seleção de vencimento(s)",
            text: "Selecione um ou mais vencimentos com status \"Em Aberto\" na grade para emitir o(s) respectivo(s) boleto(s).",
            targets: ".crudFilter .k-ireorderable:visible .check_all_row",
            subject: ".crudFilter .k-ireorderable:visible",
            autoContinue: false,
            completingConditions: [
                // exige a marcação de pelo menos um vencimento       
                function () {
                    setClickCheckbox(".check_all_row");// Checkbox Marca/desmarca todos
                    setClickCheckbox(".check_row");    // Checkbox por registro
                    return $bRetorno;
                }
            ],
            listeners: {
                beforeStep: function () {
                    $bRetorno = false;
                },
                afterStep: function () {
                    $bRetorno = false;
                }
            }
        },
        {
            title: "Emitindo boleto(s)",
            text: "Clique no botão \"Emitir Boleto(s)\" para ver o demonstrativo do(s) boleto(s) correspondente(s) aos vencimentos selecionados. " +
                  "Após este passo, você estará apto para emitir boleto(s) pelo sistema Contas a Receber-Web.",
            targets: ".submit-and-search-bar .NLSubmitBar .emissao-boleto",
            subject: ".submit-and-search-bar .NLSubmitBar .emissao-boleto",
            autoContinue: false,
            completingConditions: [
                function () {
                    setClickBtEmitirBoleto(".submit-and-search-bar .NLSubmitBar .emitir-boleto");
                    return true;
                }
            ],
            listeners: {
                beforestep: function() {
                    $(document).ready(function() {
                        setTimeout(function() {
                            $.scroll(0, { duration: 'fast' });
                        }, 1000);
                    });
                }
            }
        }

    ]
});

