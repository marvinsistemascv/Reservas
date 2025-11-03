$(document).ready(function () {
    setTimeout(function () {
        carregar_eventos();
    }, 800);
});

function carregar_eventos() {

        // util: detectar mobile (respeita breakpoint pequeno)
    function isMobile() {
        return window.matchMedia("(max-width: 576px)").matches;
    }

    // aplica opções extras de usabilidade
    function buildCalendarOptions(baseEvents) {
        const mobile = isMobile();

        // base comum
        const options = {
            defaultView: 'month',
            timeZone: 'local',
            editable: true,
            eventStartEditable: true,
            eventDurationEditable: true,
            selectable: true,
            selectHelper: true,
            allDay: true,

            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia'
            },
            allDayText: 'Dia todo',
            slotLabelFormat: 'H:mm',
            axisFormat: 'H:mm',

            views: {
                month: { buttonText: 'Mês' },
                agendaWeek: { buttonText: 'Semana' },
                agendaDay: { buttonText: 'Dia' }
            },
            dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],

            // 💡 melhorias de mobile/UX:
            eventLimit: true,               // mostra "+n" no mês
            eventLimitClick: 'popover',     // abre popover no clique
            height: 'auto',
            handleWindowResize: true,
            aspectRatio: 0.85,              // mês mais “alto”

            // seus handlers originais (colados abaixo)
            eventClick: function (event, jsEvent, view) {
                if (event.editable) {
                    Swal.fire({
                        title: event.title,
                        html: `
                            <div class="col-12">
                                <p><b>De:</b> ${moment(event.start).format('DD/MM/YYYY')}</p>
                                <p><b>Até:</b> ${moment(event.end).format('DD/MM/YYYY')}</p>
                            </div>
                            <p><b>Urgência:</b> 
                                <span style="color:${event.color}; font-weight:bold;">
                                    ${event.color === '#FF4500' ? 'Urgente' :
                                event.color === '#FF8C00' ? 'Pouco urgente' :
                                    event.color === '#1E90FF' ? 'Não urgente' :
                                        event.urgencia || '-'}
                                </span>
                            </p>
                        `,
                        grow: 'fullscreen',
                        showCancelButton: true,
                        confirmButtonText: "Concluir",
                        cancelButtonText: "Voltar"
                    }).then((result) => {
                        if (result.isConfirmed) {

                            if (event.startEditable) {
                                Swal.fire({
                                    title: "Concluir " + event.title,
                                    icon: "question",
                                    html: `                      
                                    <div class="col-12">                                                      
                                        <div class="form-group">
                                            <div class="col-4 icheck-primary d-inline">
                                                <input type="checkbox" id="radioPrimary1" name="r1" value="Repete">
                                                <label for="radioPrimary1">Repetir</label>
                                            </div>                                            
                                        </div>
                                    </div>                                 
                                `,
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    cancelButtonTTExt: "Cancelar",
                                    confirmButtonText: "Concluir"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        var formData = new FormData();
                                        formData.append("id_evento", event.event_id);

                                        fetch("/chat/concluir_evento", {
                                            method: "POST",
                                            body: formData
                                        })
                                            .then(res => {
                                                if (res.ok) {
                                                    toastr.success("Evento excluído");
                                                    carregar_eventos();
                                                } else {
                                                    toastr.error("Erro ao excluir");
                                                }
                                            });
                                    }
                                });
                            } else {
                                toastr.info("Evento de feriado não pode ser concluído");
                            }

                        }
                    });
                }
            },

            select: async function (start, end) {
                var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
                const data_evt = new Date(end);

                // se estiver usando BS5 sem jQuery, troque por API JS do Bootstrap
                $('#modal_agenda').modal('hide');

                let data_comnprimisso = moment(start).format('YYYY-MM-DD');
                data_feriado_formatado = data_evt.toLocaleDateString('UTC', options);

                const { value: formValues } = await Swal.fire({
                    title: "Compromisso para " + data_evt.toLocaleDateString('UTC', options),
                    confirmButtonText: "Confirmar",
                    icon: "info",
                    html: `                                
                        <input id="data_comprimisso" value=${data_comnprimisso} hidden="hidden" class="form-control"> 
                        <input id="descricao_comprimisso" placeholder="descrição" class="form-control">   
                        <label>Início:</label>
                        <input type="time" id="hora_inicio" value="08:00" class="form-control">
                        <label>Fim:</label>
                        <input type="time" id="hora_fim" value="09:00" class="form-control">
                        <br>
                        <div class="col-12">                                                      
                            <div class="form-group">
                                <div class="col-4 icheck-primary d-inline" style="background-color:white;">
                                    <input type="radio" id="radioPrimary1" name="r1" value="Não urgente" checked>
                                    <label for="radioPrimary1">Não urgente</label>
                                </div>
                                <div class="col-4 icheck-warning d-inline" style="background-color:white;">
                                    <input type="radio" id="radioPrimary2" name="r1" value="Pouco urgente">
                                    <label for="radioPrimary2">Pouco urgente</label>
                                </div>
                                <div class="col-4 icheck-danger d-inline" style="background-color:white;">
                                    <input type="radio" id="radioPrimary3" name="r1" value="Urgente">
                                    <label for="radioPrimary3">Urgente</label>
                                </div>
                            </div>
                        </div>                         

                        ${(userChat.tipo == "adm") ? `
                        <hr>
                            <div class="col-12">                                                     
                                <button class="btn btn-outline-primary" onclick="incluir_feriado_local('${data_comnprimisso}')">feriado local</button>                                           
                            </div> 
                        <hr> 
                        `: ''
                        }
                         
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        const data_comprimisso = document.getElementById("data_comprimisso").value;
                        const descricao = document.getElementById("descricao_comprimisso").value;
                        const prioridade = document.querySelector('input[name="r1"]:checked').value;
                        const horaInicio = document.getElementById("hora_inicio").value;
                        const horaFim = document.getElementById("hora_fim").value;

                        if (!horaInicio || !horaFim) {
                            Swal.showValidationMessage('⏰ Informe hora de início e fim');
                            return false;
                        }
                        return { data_comprimisso, descricao, prioridade, horaInicio, horaFim };
                    }
                });

                if (formValues) {
                    var formData = new FormData();
                    formData.append("evento", formValues.descricao);
                    formData.append("urgencia", formValues.prioridade);
                    formData.append("dataInicio", formValues.data_comprimisso + " " + formValues.horaInicio + ":00");
                    formData.append("dataFim", formValues.data_comprimisso + " " + formValues.horaFim + ":00");

                    fetch("/chat/gravar_novo_evento", {
                        method: "POST",
                        body: formData
                    })
                        .then(res => {
                            if (res.ok) {
                                setTimeout(() => carregar_eventos(), 500);
                                setTimeout(() => ver_agenda(), 1100);
                            } else {
                                toastr.error("Falha ao gravar o compromisso");
                            }
                        })
                        .catch(err => {
                            console.error("Erro:", err);
                        });
                }
            },

            eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
                let start = moment(event.start).format("YYYY-MM-DD HH:mm:ss");
                let end;

                if (view.name === "month") {
                    if (event.end) {
                        let duracao = moment(event.end).diff(moment(event.start), "days");
                        end = moment(event.start).add(duracao, "days").format("YYYY-MM-DD HH:mm:ss");
                    } else {
                        end = start;
                    }
                } else {
                    end = event.end
                        ? moment(event.end).format("YYYY-MM-DD HH:mm:ss")
                        : start;
                }

                var formData = new FormData();
                formData.append("id_evento", event.event_id);
                formData.append("dataInicio", start);
                formData.append("dataFim", end);

                fetch("/chat/atualizar_evento", {
                    method: "POST",
                    body: formData
                })
                    .then(res => {
                        if (res.ok) {
                            toastr.success("✅ Evento atualizado");
                        } else {
                            toastr.error("❌ Erro ao atualizar evento");
                            revertFunc();
                        }
                    })
                    .catch(err => {
                        console.error("Erro:", err);
                        revertFunc();
                    });
            },

            eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
                let start = moment(event.start).format("YYYY-MM-DD HH:mm:ss");
                let end;

                if (view.name === "month") {
                    end = event.end
                        ? moment(event.end).endOf("day").format("YYYY-MM-DD HH:mm:ss")
                        : start;
                } else {
                    end = event.end
                        ? moment(event.end).format("YYYY-MM-DD HH:mm:ss")
                        : start;
                }

                var formData = new FormData();
                formData.append("id_evento", event.event_id);
                formData.append("dataInicio", start);
                var formData = new FormData();
                formData.append("id_evento", event.event_id);
                formData.append("dataInicio", start);
                formData.append("dataFim", end);

                fetch("/chat/atualizar_evento", {
                    method: "POST",
                    body: formData
                })
                    .then(res => {
                        if (res.ok) {
                            toastr.success("✅ Evento atualizado");
                        } else {
                            toastr.error("❌ Erro ao atualizar evento");
                            revertFunc();
                        }
                    })
                    .catch(err => {
                        console.error("Erro:", err);
                        revertFunc();
                    });
            },

            events: baseEvents
        };

        // overrides específicos para mobile
        if (mobile) {
            options.header = { left: 'prev,next', center: 'title', right: 'month,agendaDay' };
            // se quiser começar direto no dia no mobile, descomente:
            // options.defaultView = 'agendaDay';

            // evitar toques acidentais:
            options.editable = false;
            options.eventStartEditable = false;
            options.eventDurationEditable = false;

            // dá pra reduzir ainda mais a densidade:
            // options.eventLimit = 3; // fixa 3 por dia no mês
        }

        return options;
    }

    // ======== carrega dados e inicia/atualiza calendário ======== 
    fetch('/clube/pegar_reservas', {  // (mantive sua rota)
        method: 'POST'
    })
        .then(response => {
            if (response.ok)
                var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then(function (result) {
                    var events = [];
                    $.each(result, function (i, item) {
                        const isFeriado = item.sit == 'feriado';
                        events.push({
                            event_id: item.id,
                            title: item.evento,
                            start: item.dataInicio,
                            end: item.dataFim || item.dataInicio,
                            editable: isFeriado,
                            startEditable: !isFeriado,
                            durationEditable: !isFeriado,
                            color: item.cor
                        });
                    });

                    if ($('#calendar').data('fullCalendar')) {
                        // já existe: só recarrega fonte e aplica opções móveis se mudou
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar('addEventSource', events);
                        $('#calendar').fullCalendar('rerenderEvents');

                        // adapta header/flags se houve mudança de layout (desktop <-> mobile)
                        const mobileNow = isMobile();
                        $('#calendar').fullCalendar('option', 'header', mobileNow
                            ? { left: 'prev,next', center: 'title', right: 'month,agendaDay' }
                            : { left: 'prev,next today', center: 'title', right: 'month,agendaWeek,agendaDay' }
                        );
                        $('#calendar').fullCalendar('option', 'editable', !mobileNow);
                        $('#calendar').fullCalendar('option', 'eventStartEditable', !mobileNow);
                        $('#calendar').fullCalendar('option', 'eventDurationEditable', !mobileNow);
                        $('#calendar').fullCalendar('option', 'eventLimit', true);
                        $('#calendar').fullCalendar('option', 'eventLimitClick', 'popover');
                        $('#calendar').fullCalendar('option', 'aspectRatio', 0.85);
                        $('#calendar').fullCalendar('option', 'height', 'auto');
                        $('#calendar').fullCalendar('option', 'handleWindowResize', true);

                    } else {
                        // inicializa uma única vez com perfil mobile/desktop
                        const options = buildCalendarOptions(events);
                        $('#calendar').fullCalendar(options);

                        // quando o modal abrir, garante render (caso esteja escondido)
                        $('#modal_agenda').on('shown.bs.modal', function () {
                            $('#calendar').fullCalendar('render');
                        });

                        // adapta dinamicamente ao redimensionar (sem lodash)
                        let resizeTimer = null;
                        $(window).on('resize', function () {
                            clearTimeout(resizeTimer);
                            resizeTimer = setTimeout(function () {
                                const mobileNow = isMobile();
                                $('#calendar').fullCalendar('option', 'header', mobileNow
                                    ? { left: 'prev,next', center: 'title', right: 'month,agendaDay' }
                                    : { left: 'prev,next today', center: 'title', right: 'month,agendaWeek,agendaDay' }
                                );
                                $('#calendar').fullCalendar('option', 'editable', !mobileNow);
                                $('#calendar').fullCalendar('option', 'eventStartEditable', !mobileNow);
                                $('#calendar').fullCalendar('option', 'eventDurationEditable', !mobileNow);
                                $('#calendar').fullCalendar('option', 'eventLimit', true);
                                $('#calendar').fullCalendar('option', 'eventLimitClick', 'popover');
                                $('#calendar').fullCalendar('option', 'aspectRatio', 0.85);
                                $('#calendar').fullCalendar('option', 'height', 'auto');
                                $('#calendar').fullCalendar('option', 'handleWindowResize', true);
                                $('#calendar').fullCalendar('render');
                            }, 250);
                        });
                    }
                });
            } else {
                console.log("Oops, nao veio JSON!");
            }
        });

}