/******************************************
    File Name: custom.js
/****************************************** */

(function ($) {
    "use strict";
    /* ==============================================
    BACK TOP
    =============================================== */
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > 1) {
            jQuery('.dmtop').css({
                bottom: "75px"
            });
        } else {
            jQuery('.dmtop').css({
                bottom: "-100px"
            });
        }
    });

    /* ==============================================
       LOADER -->
        =============================================== */

    $(window).load(function () {
        $("#preloader").on(500).fadeOut();
        $(".preloader").on(600).fadeOut("slow");
    });

    $('#contactform').submit(function () {
        var action = $(this).attr('action');
        $("#result").slideUp(750, function () {
            $('#result').hide();
            $.post(action, {
                name: $('#name').val(),
                email: $('#email').val(),
                number: $('#number').val(),
                message: $('#message').val()
            },
                function (data) {
                    document.getElementById('result').innerHTML = data.message;
                    $('#result').slideDown('slow');
                    $('#submit').removeAttr('disabled');
                    if (data.status == 200) $('#contactform').slideUp('slow');
                }
            );
        });
        return false;
    });

})(jQuery);

/*= text auto writer ==*/
var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

const AllFacts = [
    "Protein is required to form blood cells in the body. Without it, the human body could not survive",
    "Exercises to reduce hypertension include resistance exercises, aerobic exercises, isometric resistance exercises and others",
    "Most children who develop asthma will do so before their fifth birthday",
    "Dentists who work with braces and bridges, and implants, as well as replacing missing facial structures, are referred to as prosthodontics dentists",
    "If shingles affects an eye the individual may experience vision loss",
    "The most common cause of death in the United States is heart disease",
    "People with shingles should stay away from pregnant women and newborns, and those with weak immune systems",
    "Botulism is not spread by human-to-human contact",
    "Epilepsy can begin at any age, from childhood to those over the age of 65",
    "It is estimated that as much as 37% of the world's population suffers from hypertension",
    "It is also possible to die from prolonged seizures, referred to as status epilepticus",
    "In the Americas yellow fever is most common in Bolivia, Brazil, Ecuador, Columbia, and Peru",
    "Eating a lot of salt can result in dehydration.",
    "People should also use lip balm with sunscreen to help protect the lips from the risk of skin cancer",
    "You can't drown head lice by keeping your hair under water. They can hold their breath for up to eight hours",
    "Smallpox was wiped out because of the vaccine. Vaccination for the disease is no longer required",
    "The second most common type of bacterial pneumonia is haemophilus influenza.",
    "It can take several years for symptoms of high blood pressure to appear, even when readings are very high",
    "It would take the caffeine found in 100 cups of coffee, consumed in four hours, to kill an adult.",
    "Once infected with malaria, a person's chances of survival often depend on how quickly they seek treatment"
];
let f = document.getElementById("FactArea");
if (f) f.innerHTML = AllFacts[Math.floor(Math.random() * AllFacts.length)];
