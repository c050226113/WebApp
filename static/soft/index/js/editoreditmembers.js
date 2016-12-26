Editor = null;
Editor = {
    initAvatar: 0,
    eq: 0,
    phoneNum: null,
    role: null,
    obj: null,
    init: function (text, index) {
        if (index > 6) {
            Message.toast(Language.data_error, 2);
            return false;
        }

        this.eq = index - 1;

        this.obj = $("#" + text);
        this.obj.find(".operations").slideUp(100);
        this.obj.find(".more").attr("title", "");
        this.role = index;

        var phoneArr;

        this.obj.find(".setAdmin").show();
        this.obj.find("#shortNumber").parent().show();

        var lis = $("#right .members .z_item");
        var name = lis.eq((index - 1)).find(".name").text();
        if(name.indexOf("\(" + Language.admin + "\)")>=0){
            this.obj.find(".cancel_sub").text(Language.cancel_sub);
            name = name.replace("\(" + Language.admin + "\)", "");
        }else{
            this.obj.find(".cancel_sub").text(Language.delete_member);
        }
        this.obj.find("#name").val(name);

        phoneArr = lis.eq((index - 1)).find(".phoneNumber").text().split("(");
        this.obj.find("#myModalLabel").html("<img src='" + lis.eq((index - 1)).find(".head_img").attr("src") + "'>" + Language.information_modification);

        this.obj.find("#phoneNumber").val(phoneArr[0]);
        this.phoneNum = phoneArr[0];
        if (phoneArr[1]) {
            this.obj.find("#shortNumber").val(phoneArr[1].substr(0, phoneArr[1].length - 1));
        } else {
            this.obj.find("#shortNumber").val(undefined);
        }

        this.initAvatar = Phb.pba[BabyInfo.index].split(",");
        this.initAvatar = (this.initAvatar[index -1]);
        if(isNaN(this.initAvatar)){
            this.initAvatar = this.role;
        }
        this.obj.find(".currentAvatar_box .currentAvatar").attr("src", imgUrl+"contact_avatar" + this.initAvatar + ".png").attr("title", this.initAvatar);
        this.obj.find(".avatar_box").each(function (index, obj) {
            if (index + 1 == Editor.initAvatar) {
                $(obj).css("border", "solid 2px red").addClass("active");
            } else {
                $(obj).css("border", "solid 2px white");
            }
            $(obj).find("img").attr("src", imgUrl+"contact_avatar" + (index + 1) + ".png")
        });

        $("#mo").attr("data-target", "#" + text).trigger("click");
    },
    editorSubmit: function () {
        if (!BabyInfo.isAdmin()) {
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var lis = $("#right .members .z_item");

        var old_name, old_phoneArr, old_phone, old_shortNumber;
        var name, shortNumber, phoneNumber;
        old_name = lis.eq(this.eq).find(".name").text();
        old_phoneArr = lis.eq(this.eq).find(".phoneNumber").text().split("(");
        old_phone = old_phoneArr[0];
        old_shortNumber = old_phoneArr[1] ? old_phoneArr[1].substr(0, (old_phoneArr[1].length - 1)) : "";

        name = this.obj.find("#name").val();
        shortNumber = this.obj.find("#shortNumber").val();
        phoneNumber = this.obj.find("#phoneNumber").val();

        var avatarNum = this.obj.find(".currentAvatar").attr("title");
        var pba = "";
        if (avatarNum != this.initAvatar) {
            pba = avatarNum;
        }

        if (name == old_name && !pba && shortNumber == old_shortNumber) {
            return false;
        }

        if ((name != old_name || pba) && shortNumber == old_shortNumber) {

            var pbn = "";
            $(".members .item").each(function (index, obj) {
                var name_temp = $(this).find(".name").text().replace("\(" + Language.admin + "\)", "");
                if (index == (Editor.eq)) {
                    name_temp = name;
                }
                pbn += name_temp;
                pbn += ",";
            });
            pbn = pbn.substr(0, (pbn.length - 1));

            var pbaStr = "";
            if (!pba) {
                pbaStr = Phb.pba[BabyInfo.index];
            } else {
                var arr = Phb.pba[BabyInfo.index].split(",");
                for (var i = 0; i < 20; i++) {
                    if (i + 1 == Editor.role) {
                        pbaStr += pba + ",";
                    } else {
                        pbaStr += arr[i] + ",";
                    }
                }
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/modifymembername',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"],
                    pba: pbaStr,
                    pbn: pbn
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        Message.toast(Language.modify_success + "!");
                        var lis = $(".members .item");
                        if (account == old_phone) {
                            lis.eq(Editor.eq).find(".name").text(name + "(" + Language.admin + ")");
                        } else {
                            lis.eq(Editor.eq).find(".name").text(name);
                        }

                        if (pba) {
                            lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                            Phb.pba[BabyInfo.index] = pbaStr;
                        }

                        Editor.obj.find(".kill").trigger("click");
                    } else if (data.code == 1) {
                         P_index.checkTokenError(data.msg);
                    //    Message.toast(Language.modify_fail + "!");
                    } else {
                        Message.toast(data.msg + "!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error + "!");
                }
            });
        } else if ((name == old_name && !pba) && shortNumber != old_shortNumber) {

            if (shortNumber.length < 3 || shortNumber.length > 7 || isNaN(shortNumber)) {
                Message.toast(Language.short_number_error + "!");
                return false;
            }

            if(shortNumber){
                shortNumber = parseInt(shortNumber) + "";
            }else{
                shortNumber = "000";
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/modifymembershort',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"],
                    sr: (Editor.eq + 1),
                    num: shortNumber
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        Message.toast(Language.modify_success + "!");
                        var lis = $(".members .item");
                        if(shortNumber != "000"){
                            lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber + "(" + shortNumber + ")");
                        }else{
                            lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber);
                        }
                        Editor.obj.find(".kill").trigger("click");
                    } else {
                        P_index.checkTokenError(data.msg);
                        //Message.toast(data.msg + "!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error + "!");
                }
            });
        } else {
            var type = 0;
            var pbn = "";
            $(".members .item").each(function (index, obj) {
                var name_temp = $(this).find(".name").text().replace("\(" + Language.admin + "\)", "");
                if (index == (Editor.eq)) {
                    name_temp = name;
                }
                pbn += name_temp;
                pbn += ",";
            });
            pbn = pbn.substr(0, (pbn.length - 1));

            var pbaStr = "";
            if (!pba) {
                pbaStr = Phb.pba[BabyInfo.index];
            } else {
                var arr = Phb.pba[BabyInfo.index].split(",");
                for (var i = 0; i < 20; i++) {
                    if (i + 1 == Editor.role) {
                        pbaStr += pba + ",";
                    } else {
                        pbaStr += arr[i] + ",";
                    }
                }
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/modifymembername',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"],
                    pba: pbaStr,
                    pbn: pbn
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        type = type + 1;
                    } else {
                      P_index.checkTokenError(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                },
                complete: function () {
                    if(shortNumber){
                        shortNumber = parseInt(shortNumber) + "";
                    }else{
                        shortNumber = "000";
                    }

                    if (shortNumber.length < 3 || shortNumber.length > 7) {
                        Message.toast(Language.short_number_error + "!");
                        return false;
                    }

                    $.ajax({
                        type: 'post',
                        url: indexUrl + '?r=setting/modifymembershort',
                        data: {
                            device: devicesData[BabyInfo.index]["D"],
                            role: devicesData[BabyInfo.index]["R"],
                            sr: (Editor.eq + 1),
                            num: shortNumber
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.code == 0) {
                                type = type + 2;
                            } else {
                              P_index.checkTokenError(data.msg);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {},
                        complete: function () {
                            switch (type) {
                                case 0:
                                    Message.toast(Language.modify_fail);
                                    break;
                                case 1:
                                    Message.toast(Language.name_modify_success_short_modify_error);
                                    var lis = $(".members .item");
                                    if (account == old_phone) {
                                        lis.eq(Editor.eq).find(".name").text(name + "(" + Language.admin + ")");
                                    } else {
                                        lis.eq(Editor.eq).find(".name").text(name);
                                    }
                                    if (pba) {
                                        lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                                        Phb.pba[BabyInfo.index] = pbaStr;
                                    }
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                                case 2:
                                    Message.toast(Language.short_modify_success_name_modify_error);
                                    if(shortNumber != "000"){
                                        lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber + "(" + shortNumber + ")");
                                    }else{
                                        lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber);
                                    }
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                                case 3:
                                    Message.toast(Language.short_modify_success_name_modify_success);
                                    var lis = $(".members .item");
                                    if (account == old_phone) {
                                        lis.eq(Editor.eq).find(".name").text(name + "(" + Language.admin + ")");
                                    } else {
                                        lis.eq(Editor.eq).find(".name").text(name);
                                    }
                                    if (pba) {
                                        lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                                        Phb.pba[BabyInfo.index] = pbaStr;
                                    }
                                    if(shortNumber != "000"){
                                        lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber + "(" + shortNumber + ")");
                                    }else{
                                        lis.eq(Editor.eq).find(".phoneNumber").text(phoneNumber);
                                    }
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                            }
                        }
                    });
                }
            });

        }
    },
    cancelSub: function () {
        if (!BabyInfo.isAdmin()) {
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var str;
        if (account == this.phoneNum) {
            str = Language.after_removing_all_the_characters + "?";
            var dialogArr = Message.dialog('提示', str, '确定', '取消');
            dialogArr[0].find("#all_notice_button1").click(function () {
                Message.removeDialog();
                Editor.cancelSubBySelf();
            });
            dialogArr[0].find("#all_notice_button2").click(function () {
                Message.removeDialog();
            });
        } else {
            str = Language.are_you_sure_you_want_to_delete_this_member_of_the_family + "?";
            var dialogArr = Message.dialog('提示', str, '确定', '取消');
            dialogArr[0].find("#all_notice_button1").click(function () {
                Message.removeDialog();
                Editor.delFamily();
            });
            dialogArr[0].find("#all_notice_button2").click(function () {
                Message.removeDialog();
            });
        }
    },
    moreOperation: function (obj) {
        if (!BabyInfo.isAdmin()) {
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }
        if (!obj.attr("title")) {
            this.obj.find(".operations").slideDown();
            obj.attr("title", "true");
        } else {
            this.obj.find(".operations").slideUp();
            obj.attr("title", "");
        }
    },
    cancelSubBySelf: function () {
        var adminPassword = this.obj.find("#adminPassword").val();
        if (!adminPassword) {
            Message.toast(Language.please_enter_admin_password);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl + '?r=setting/adminunsubscribe',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                adminPassword: adminPassword
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    Message.toast(Language.cancel_success + "!");
                    window.location.href = indexUrl + '?r=index/logout';
                } else {
                  P_index.checkTokenError(data.msg);
                    Message.toast(Language.cancel_fail + "!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error + "!");
            }
        });
    },
    delFamily: function () {
        var adminPassword = this.obj.find("#adminPassword").val();
        if (!adminPassword) {
            Message.toast(Language.please_enter_admin_password);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl + '?r=setting/admindelfamily',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                adminPassword: adminPassword,
                delAccount: Editor.phoneNum,
                opRole: Editor.role
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    $(".members .item").eq((Editor.role - 1)).attr("title", "").find(".phoneNumber").text(Language.add_member);
                    Message.toast(Language.cancel_success + "!");
                    Editor.obj.find(".kill").trigger("click");
                } else {
                  P_index.checkTokenError(data.msg);
                    Message.toast(Language.cancel_fail + "!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error + "!");
            }
        });
    },
    setAdmin: function () {
        if (!BabyInfo.isAdmin()) {
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified + "!");
            return false;
        }

        if (account == this.phoneNum) {
            Message.toast(Language.you_are_the_admin_already);
            return false;
        }

        var dialogArr = Message.dialog('提示', Language.are_you_sure_you_want_to_upgrade_the_member_as_an_administrator + "?", '确定', '取消');
        dialogArr[0].find("#all_notice_button1").click(function () {
            Message.removeDialog();
            var adminPassword = Editor.obj.find("#adminPassword").val();
            if (!adminPassword) {
                Message.toast(Language.please_enter_admin_password + "!");
                return false;
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/adminchange',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"],
                    adminPassword: adminPassword,
                    opRole: Editor.role
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        Message.toast(Language.modify_success + "!");
                        devicesData[BabyInfo.index]["A"] = 0;
                        Editor.obj.find(".kill").trigger("click");
                        var lis = $(".members .item");
                        lis.eq((devicesData[BabyInfo.index]["R"] - 1)).find(".name").text(lis.eq((devicesData[BabyInfo.index]["R"] - 1)).find(".name").text().replace("\(" + Language.admin + "\)", ""));
                        lis.eq((Editor.role - 1)).find(".name").text(lis.eq((Editor.role - 1)).find(".name").text() + "(" + Language.admin + ")");
                    } else {
                        P_index.checkTokenError(data.msg);
                        //Message.toast(Language.modify_fail + "!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error);
                }
            });
        });
        dialogArr[0].find("#all_notice_button2").click(function () {
            Message.removeDialog();
        });
    },
    choose_avatar: function (obj) {
        if (!obj.hasClass("active")) {
            obj.parent().children().css("border", "solid 2px white").removeClass("active");
            obj.addClass("active").css("border", "solid 2px red");

            this.obj.find(".currentAvatar").attr("src", imgUrl+"contact_avatar" + obj.attr("title") + ".png").attr("title", obj.attr("title"));
        }
    }
};
