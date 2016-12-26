var $clearInput = $(".clearInput");

$clearInput.click(function () {
    $(this).parent().find("input").val("");
});