/**
 * 表单验证工具
 * ===============================使用说明=============================================================
 * 调用： SteelValidator.init(param);
 * 其中
 *   param.id                    表单的ID或样式。如#myform或.form-horizontal
 *   param.func                  验证成功后的回调函数
 *   param.vlist                 表单校验规则清单
 * 校验清单格式如下：
 * name : {                      表单元素名
 *    required :{                规定则关键字，具体参照规则清单
 *               rule:true,      校验规则
 *               tip:""          校验提示信息
 *              }
 * }
 *
 * ==============================表单校验规则清单========================================================
 *(1)required:true                 必输字段
 *(2)remote:"check.php"            使用ajax方法调用check.php验证输入值
 *(3)email:true                    必须输入正确格式的电子邮件
 *(4)url:true                      必须输入正确格式的网址
 *(5)date:true                     必须输入正确格式的日期 日期校验ie6出错，慎用
 *(6)dateISO:true                  必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性
 *(7)number:true                   必须输入合法的数字(负数，小数)
 *(8)digits:true                   必须输入整数
 *(9)creditcard:                   必须输入合法的信用卡号
 *(10)equalTo:"#field"             输入值必须和#field相同
 *(11)accept:                      输入拥有合法后缀名的字符串（上传文件的后缀）
 *(12)maxlength:5                  输入长度最多是5的字符串(汉字算一个字符)
 *(13)minlength:10                 输入长度最小是10的字符串(汉字算一个字符)
 *(14)rangelength:[5,10]           输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符)
 *(15)range:[5,10]                 输入值必须介于 5 和 10 之间
 *(16)max:5                        输入值不能大于5
 *(17)min:10                       输入值不能小于10
 *=================================================================================================
 */

var SteelValidator = function() {

	var handleSubmit = function(param) {

		$(param.id).validate({
			errorElement : 'span',
			errorClass : 'help-block',
			focusInvalid : false,
			onfocusout : function(element) {
				//$(element).removeData("previousValue");
				$(element).valid();
			},
			onkeyup : function(element) {
				//$(element).removeData("previousValue");
				$(element).valid();
			},
			rules : param.rules,
			messages : param.messages,

			highlight : function(element) {
				$(element).closest('.form-group').addClass('has-error');
			},

			success : function(label) {
				label.closest('.form-group').removeClass('has-error');
				label.remove();
			},

			errorPlacement : function(error, element) {
				element.parent('div').append(error);
			},

			submitHandler : function(form) {
				form.submit();
			}
		});

		$(param.id).find('input').keypress(function(e) {
			if (e.which == 13) {
				if ($(param.id).validate().form()) {
					$(param.id).submit();
				}
				return false;
			}
		});

	};
	return {
		init : function(param) {
			if ($(param.id).length == 0) {
				alert("请设置表单的ID或样式！");
				return;
			}
			if (typeof param.vlist == "undefined") {
				param.vlist = {};
			}

			var rules = jQuery.extend(true, {}, param.vlist);
			var messages = jQuery.extend(true, {}, param.vlist);
			$.each(param.vlist, function(key, values) {
				var eName = key;

				$.each(values, function(key, values) {
					var ruleName = key;
					rules[eName][ruleName] = values.rule;
					messages[eName][ruleName] = values.tip;
				});
			});
			param.rules = rules, param.messages = messages, handleSubmit(param);
		}
	};

}();
