!function ($) {
    if ($.ui.slider)
    {
        // add minimum range length option
        $.extend($.ui.slider.prototype.options, {
            minRangeSize: 0,
            maxRangeSize: 100,
            autoShift: false,
            lowMax: 100,
            topMin: 0
        });

        $.extend($.ui.slider.prototype, {
            _slide: function (event, index, newVal) {
                var otherVal,
                    newValues,
                    allowed,
                    factor;

                if (this.options.values && this.options.values.length)
                {
                    otherVal = this.values(index ? 0 : 1);
                    factor = index === 0 ? 1 : -1;

                    if (this.options.values.length === 2 && this.options.range === true)
                    {
                        // lower bound max
                        if (index === 0 && newVal > this.options.lowMax)
                        {
                            newVal = this.options.lowMax;
                        }
                        // upper bound min
                        if (index === 1 && newVal < this.options.topMin)
                        {
                            newVal = this.options.topMin;
                        }
                        // minimum range requirements
                        if ((otherVal - newVal) * factor < this.options.minRangeSize)
                        {
                            newVal = otherVal - this.options.minRangeSize * factor;
                        }
                        // maximum range requirements
                        if ((otherVal - newVal) * factor > this.options.maxRangeSize)
                        {
                            if (this.options.autoShift === true)
                            {
                                otherVal = newVal + this.options.maxRangeSize * factor;
                            }
                            else
                            {
                                newVal = otherVal - this.options.maxRangeSize * factor;
                            }
                        }
                    }

                    if (newVal !== this.values(index))
                    {
                        newValues = this.values();
                        newValues[index] = newVal;
                        newValues[index ? 0 : 1] = otherVal;
                        // A slide can be canceled by returning false from the slide callback
                        allowed = this._trigger("slide", event, {
                            handle: this.handles[index],
                            value: newVal,
                            values: newValues
                        });
                        // otherVal = this.values(index ? 0 : 1);
                        if (allowed !== false)
                        {
                            this.values(index, newVal, true);
                            this.values((index + 1) % 2, otherVal, true);
                        }
                    }
                } else
                {
                    if (newVal !== this.value())
                    {
                        // A slide can be canceled by returning false from the slide callback
                        allowed = this._trigger("slide", event, {
                            handle: this.handles[index],
                            value: newVal
                        });
                        if (allowed !== false)
                        {
                            this.value(newVal);
                        }
                    }
                }
            }
        });
    }
}(window.jQuery);
