$(function () {
    var definitions = {};
    var tags = [];
    var $definitionsDropDown = $('#definitions');
    var $tagsDropDown = $('#tags');
    $.get('/api/v1/swagger/config/', function (data) {
        definitions = data.definitions;
        tags = data.tags;

        for (var key in definitions) {
            $definitionsDropDown.append('<option value="' + key + '">' + key + '</option>')
        }

        tags.forEach(function (value) {
            if (value) {
                $tagsDropDown.append('<option value="' + value.name + '">' + value.name + '</option>')
            }
        })
    });

    $definitionsDropDown.on('change', function () {
        var value = $(this).val();
        if (definitions[value]) {
            $('#editor_name').val(value);
            var modelDef = JSON.stringify(handleDefinitionModel(definitions[value]), null, 4);
            $('#editor_schema').val(modelDef);
        }

        return false;
    });

    function handleArray (arrayModel) {
        if(!arrayModel.items) {
            return [];
        }

        return [].push(handleDefinitionModel(arrayModel.items));
    }

    function handleDefinitionModel (model) {
        var types = {
            'integer': function () {return 0},
            'string': function () {return 'string'},
            'boolean': function () {return true},
            'object': handleDefinitionModel,
            'array': handleArray
        };
        var dummy;
        if (!model.type || model.type == 'object') {
            dummy = {};
            for(var key in model.properties) {
                if (model.properties[key].type) {
                    dummy[key] = types[model.properties[key].type](model.properties[key])
                } else if (model.properties[key].$ref) {
                    var $ref = model.properties[key].$ref.split('/').pop();
                    if (definitions[$ref]) {
                        dummy[key] = handleDefinitionModel(definitions[$ref]);
                    }
                }
            }

            return dummy;
        } else {
            return types[model.type](model)
        }
    }


    $(document)
    .on('click', '.tab-button', function () {
        if ($(this).hasClass('checked')) {
            return false;
        }

        $('.tab-button').toggleClass('checked');
        $('.tab-page').toggleClass('visible')
    })
});