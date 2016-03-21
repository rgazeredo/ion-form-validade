angular.module('starter.directives', [])

.directive('ionFormValidate', ['$parse', '$ionicPopup', function($parse, $ionicPopup) {
	return {
		require: '^form',
		restrict: 'A',
		link: function(scope, element, attrs, form) {
			form.$submitted = false;
			var fn = $parse(attrs.ionFormValidate);
			element.on('submit', function(event) {
				scope.$apply(function() {
					element.addClass('ng-submitted');
					form.$submitted = true;
					if (form.$valid) {
						if (typeof fn === 'function') {
							fn(scope, {$event: event});
						}
					} else {

						function getField(fieldName) {
							var allElements = element.find("*");
					        for(var i = 0; i < allElements.length; i++) {
								var attributes = allElements[i].attributes;
								if (attributes.getNamedItem('ng-model') != null)
								{
									var field = angular.element(allElements[i]);
									if(field.attr('name') == fieldName)
									{
										return field;
									}
								}
							}
						}

						var error_messages = "";
						//required
						if(form.$error.required)
						{
							for (var i = 0; i < form.$error.required.length; i++) {
								var field = getField(form.$error.required[i].$name);
								error_messages = error_messages.concat("O campo "+ field.attr('placeholder') +" é obrigatório!<br />");
							}
						}

						//email
						if(form.$error.email)
						{
							for (var i = 0; i < form.$error.email.length; i++) {
								var field = getField(form.$error.email[i].$name);
								error_messages = error_messages.concat("O campo "+ field.attr('placeholder') +" deve ser do tipo e-mail!<br />");
							}
						}

						//minlength
						if(form.$error.minlength)
						{
							for (var i = 0; i < form.$error.minlength.length; i++) {
								var field = getField(form.$error.minlength[i].$name);
								error_messages = error_messages.concat("O campo "+ field.attr('placeholder') +" deve ter no mínimo "+ field.attr('minlength') +" caracteres!<br />");
							}
						}

  						$ionicPopup.show({
						    template: error_messages,
						    title: 'Validação',
						    buttons: [
						      { text: 'OK' },
						    ]
					  	});
					}
				});
			});
		}
	}
}])