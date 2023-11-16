let inputValue = "";
let isRequired;
let requiredMessage;
let selectedDayColor = Appian.getAccentColor();
let currentDayColor = Appian.getAccentColor();

let selectMonthElement;

let component = $("#hijri-date-input").data("HijriDatePicker");
console.log("component: " + component);
console.log("hide called");
component.hide();

console.log("Appian.getLocale(): " + Appian.getLocale());
if (Appian.getLocale() === "ar") {
  $(".container").css("justify-content", "flex-end");
  $(".form-control").css("text-align", "end");
} else {
  $(".container").css("justify-content", "flex-start");
  $(".form-control").css("text-align", "start");
}

var formControl = $(".form-control");

formControl.on("focus", function () {
  formControl.css("border-color", Appian.getAccentColor());
});

formControl.on("blur", function () {
  formControl.css("border-color", "initial"); // Reset border color to initial value on blur
});

const hijriConfigs = {
  // timezone
  timeZone: "Etc/UTC",

  inline: true,
  // Date format. See moment.js docs for valid formats.
  format: "D/M/YYYY",
  hijriFormat: "iD/iM/iYYYY",
  hijriDayViewHeaderFormat: "iMMMM iYYYY",

  // Changes the heading of the datepicker when in "days" view.
  dayViewHeaderFormat: "MMMM YYYY",

  // Prevents date/time selections before this date
  minDate: "1947-1-1",

  // Prevents date/time selections after this date
  maxDate: "2065-1-1",

  // See moment.js for valid locales.
  locale: Appian.getLocale() === "ar" ? "ar-SA" : "en",

  // CSS selector
  datepickerInput: ".datepickerinput",

  // Use hijri date
  hijri: true,

  // If `false`, the textbox will not be given focus when the picker is shown.
  focusOnShow: false,

  // If `true`, the picker will show on textbox focus and icon click when used in a button group.
  allowInputToggle: false,
};

$(function () {
  $("#hijri-date-input").hijriDatePicker(hijriConfigs);
  Appian.Component.onNewValue(function (newValues) {
    //initialize and update some values
    isRequired = newValues.required;
    requiredMessage = newValues.requiredMessage;

    /* handle accent color */
    selectedDayColor = newValues.selectedDayColor
      ? newValues.selectedDayColor
      : selectedDayColor;
    currentDayColor = newValues.currentDayColor
      ? newValues.currentDayColor
      : currentDayColor;

    setColors(selectedDayColor, currentDayColor);
    console.log("selectedDayColor: " + selectedDayColor);
    console.log("currentDayColor: " + currentDayColor);

    //manage initial and updated value
    inputValue = newValues.hijriDate;
    document.getElementById("hijri-date-input").value = inputValue;
    console.log("New value received: " + inputValue);

    //manage disabled
    if (newValues.disabled) {
      component.disable();
    } else {
      component.enable();
    }
    let borderRadius = newValues.shape;
    //manage border radius
    if (borderRadius) {
      switch (borderRadius) {
        case "SQUARED":
          borderRadius = "0px";
          break;
        case "SEMI_ROUNDED":
          borderRadius = "0.2857rem";
          break;
      }
      $("#hijri-date-input").css("border-radius", borderRadius);
    } else {
      $("#hijri-date-input").css("border-radius", "0px");
    }
    checkValidations(requiredMessage, isRequired);
    // console.log("disabled: " + newValues.disabled);
  });

  // Use the 'dp.change' event to capture changes in the date picker
  $("#hijri-date-input").on("dp.change", function (e) {
    inputValue = e.target.value;
    console.log("Input value changed: " + inputValue);
    Appian.Component.saveValue("onChange", inputValue);
    setColors(selectedDayColor, currentDayColor);

    checkValidations(requiredMessage, isRequired);
  });

  $("#hijri-date-input").on("dp.hide", function () {
    setColors(selectedDayColor, currentDayColor);
  });
  $("#hijri-date-input").on("dp.show", function () {
    setColors(selectedDayColor, currentDayColor);
  });

  $("#hijri-date-input").on("dp.update", function () {
    setColors(selectedDayColor, currentDayColor);
  });

  function checkValidations(requiredMessage, isRequired) {
    console.log("checkValidations function called");
    if (isRequired && inputValue == "") {
      let validationMessage;
      if (requiredMessage) {
        validationMessage = requiredMessage;
      } else {
        if (Appian.getLocale() === "ar") {
          validationMessage = "مطلوب قيمة";
        } else {
          validationMessage = "A value is required";
        }
      }
      console.log("validationMessage: " + validationMessage);
      Appian.Component.setValidations(validationMessage);
    } else {
      console.log("validationMessage: empty");
      Appian.Component.setValidations([]);
    }
  }

  function setColors(localSelectedDayColor, localCurrentDayColor) {
    $(".datepicker tbody tr > td.day.active").css(
      "background",
      localSelectedDayColor
    );
    if (selectMonthElement) {
      selectMonthElement.css("background", "");
    }
    selectMonthElement = $(".datepicker tbody tr > td span.month.active");
    selectMonthElement.css("background", localSelectedDayColor);

    $(".datepicker tbody tr > td span.year.active").css(
      "background",
      localSelectedDayColor
    );
    $(".datepicker tbody tr > td.day.today").css(
      "background",
      localCurrentDayColor
    );
  }
});
