$(function(){

    $('[data-toggle="tooltip"]').tooltip();
    $('.select2-estados').select2({
        placeholder: "Selecione uma opção",
          allowClear: true,
          theme: "bootstrap"
    });
});