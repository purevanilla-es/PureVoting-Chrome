now = (new Date).getTime();
domain = window.location.hostname;
updates = 0
checkMatch()

function updatesites() {
    updates = updates + 1
    if (updates > 3) {
        if (updates < 5) {
            console.log("[Pure Vanilla] Error updating")
        }
    } else {
        console.log("[Pure Vanilla] Updating voting sites list")
        $.getJSON("https://purevanilla.es/api/voting/sites/", function (json) {

            var domainnames = []
            json.forEach(element => {
                domainnames.push(element.name)
            });

            console.log("[Pure Vanilla] New site list: " + domainnames);

            domainlistjson = JSON.stringify(domainnames)
            datajson = JSON.stringify(json)

            chrome.storage.sync.set({ 'update': now, 'domainlist': domainlistjson, 'data': datajson }, function () {
                console.log("[Pure Vanilla] Stored update #" + now)
            });
        });
    }

    updatesites()
}

function getElement(id, name, cssclass) {
    var element = null;
    if (id != null) {
        if ($("#" + id) != null) {
            element = $("#" + id)
        } else {
            if ($("[name=" + name + "]") != null) {
                element = $("[name=" + name + "]")
            } else {
                if ($("." + cssclass) != null) {
                    element = $("." + cssclass)
                }
            }
        }
    } else if (name != null) {
        if ($("[name=" + name + "]") != null) {
            element = $("[name=" + name + "]")
        } else {
            if ($("." + cssclass) != null) {
                element = $("." + cssclass)
            }
        }
    } else {
        if ($("." + cssclass) != null) {
            element = $("." + cssclass)
        }
    }

    return element;
}

function checkMatch() {
    chrome.storage.sync.get(['update', 'domainlist', 'data'], function (items) {
        if (items.update == null) {
            updatesites()
        } else {
            if (now - items.update > 43200000) {
                console.log("[Pure Vanilla] Data is too old, updating");
                updatesites()
            } else {
                if (JSON.parse(items.domainlist).includes(domain)) {
                    console.log("[Pure Vanilla] This website is listed as a registered voting site")
                    console.log("[Pure Vanilla] No previous vote registered")
                    sitealldata = JSON.parse(items.data)
                    sitealldata.forEach(element => {
                        if (element.name == window.location.hostname) {

                            if (window.location != element.url) {
                                window.location.replace(element.url);
                            }

                            setTimeout(
                                function () {
                                    gideSite(element)
                                }, 100);
                        }
                    });
                }
            }
        }
    });
}

function gideSite(sitedata) {
    username = sitedata.username
    usernameinput = getElement(username.id, username.name, username.class)

    chrome.storage.sync.get(['username'], function (items) {
        if (items.username == null) {
            usernameinput.val("quiquelhappy")
        } else {
            usernameinput.val(items.username)
        }
    });

    vote = sitedata.vote
    if (vote != undefined) {
        voteinput = getElement(vote.id, vote.name, vote.class)
    }

    captcha = sitedata.captcha
    if (captcha != undefined) {
        captchainput = getElement(captcha.id, captcha.name, captcha.class)
        captchainput.addClass("tutorial-visible")
        if (captcha.class == "g-recaptcha") {
            executed = false
            window.setInterval(function () {
                if ($("#g-recaptcha-response").val().length > 1) {
                    if (!executed) {
                        executed = true
                        $(voteinput).click();
                        setTimeout(
                            function () {
                                window.close();
                            }, 1500);
                    }
                } else {
                    if (captcha.auto) {
                        if (!executed) {
                            setTimeout(
                                function () {
                                    executed = true
                                    $(voteinput).click();
                                    window.alert("please, close the window if the vote was registered")
                                }, 500);
                        }

                    }
                }
            }, 300);
        }
    }
}