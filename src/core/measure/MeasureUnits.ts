// q@ts-nocheck
/* qeslint-disable */
/* eslint-disable no-param-reassign, spaced-comment, prefer-const, no-use-before-define, no-else-return, prefer-template, radix, consistent-return, @typescript-eslint/no-use-before-define */
// @ts-ignore
import { Check, defaultValue, DeveloperError, Math as CesiumMath, RuntimeError } from "cesium";
import DistanceUnits from "./DistanceUnits";
import AreaUnits from "./AreaUnits";
import VolumeUnits from "./VolumeUnits";
import AngleUnits from "./AngleUnits";

interface MeasureUnitsConstructorOptions {
    areaUnits?: string;
    distanceUnits?: string;
    volumeUnits?: string;
    angleUnits?: string;
    slopeUnits?: string;
}

class MeasureUnits {
    distanceUnits: string;
    areaUnits: string;
    volumeUnits: string;
    angleUnits: string;
    slopeUnits: string;

    constructor(options: MeasureUnitsConstructorOptions) {
        // @ts-ignore
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        // @ts-ignore
        this.distanceUnits = defaultValue(options.distanceUnits, DistanceUnits.METERS);
        // @ts-ignore
        this.areaUnits = defaultValue(options.areaUnits, AreaUnits.SQUARE_METERS);
        // @ts-ignore
        this.volumeUnits = defaultValue(options.volumeUnits, VolumeUnits.CUBIC_METERS);
        // @ts-ignore
        this.angleUnits = defaultValue(options.angleUnits, AngleUnits.DEGREES);
        // @ts-ignore
        this.slopeUnits = defaultValue(options.slopeUnits, AngleUnits.DEGREES);
    }

    static convertDistance: (distance: number, from: string, to: string) => number;
    static convertArea: (area: number, from: string, to: string) => number;
    static convertVolume: (volume: number, from: string, to: string) => number;
    static convertAngle: (angle: number, from: string, to: string) => number;
    static numberToString: (
        number: number,
        selectedLocale: string | string[],
        maximumFractionDigits: number,
        minimumFractionDigits: number
    ) => string;

    static distanceToString: (
        meters: number,
        distanceUnits: string,
        selectedLocale: string | string[] | undefined,
        maximumFractionDigits: number | undefined,
        minimumFractionDigits: number | undefined
    ) => string;

    static getDistanceUnitSpacing: (_distanceUnits: string) => string;

    static getDistanceUnitSymbol: (distanceUnits: string) => string;

    static areaToString: (
        metersSquared: number,
        areaUnits: string,
        selectedLocale: string | string[] | undefined,
        maximumFractionDigits: number | undefined,
        minimumFractionDigits: number | undefined
    ) => string;

    static getAreaUnitSpacing: (areaUnits: string) => string;

    static getAreaUnitSymbol: (areaUnits: string) => string;

    static volumeToString: (
        metersCubed: number,
        volumeUnits: string,
        selectedLocale: string | string[],
        maximumFractionDigits: number,
        minimumFractionDigits: number
    ) => string;

    static getVolumeUnitSpacing: (volumeUnits: string) => string;
    static getVolumeUnitSymbol: (volumeUnits: string) => string;

    static angleToString: (
        angleRadians: number,
        angleUnits: string,
        selectedLocale: string | string[],
        maximumFractionDigits: number,
        minimumFractionDigits: number
    ) => string | undefined;

    static getAngleUnitSpacing: (angleUnits: string) => string;

    static getAngleUnitSymbol: (angleUnits: string) => string;

    static longitudeToString: (
        longitude: number,
        angleUnits: string,
        selectedLocale: string,
        maximumFractionDigits: number,
        minimumFractionDigits: number
    ) => string;

    static latitudeToString: (
        latitude: number,
        angleUnits: string,
        selectedLocale: string | string[],
        maximumFractionDigits: number,
        minimumFractionDigits: number
    ) => string;
}

MeasureUnits.convertDistance = function (distance, from, to) {
    if (from === to) {
        return distance;
    }

    const toMeters = getDistanceUnitConversion(from);
    let fromMeters = 1.0 / getDistanceUnitConversion(to);

    return distance * toMeters * fromMeters;
};

MeasureUnits.convertArea = function (area, from, to) {
    if (from === to) {
        return area;
    }
    let toMeters = getAreaUnitConversion(from);
    let fromMeters = 1.0 / getAreaUnitConversion(to);
    return area * toMeters * fromMeters;
};

MeasureUnits.convertVolume = function (volume, from, to) {
    if (from === to) {
        return volume;
    }
    let toMeters = getVolumeUnitConversion(from);
    let fromMeters = 1.0 / getVolumeUnitConversion(to);
    return volume * toMeters * fromMeters;
};

MeasureUnits.convertAngle = function (angle, from, to) {
    if (from === to) {
        return angle;
    }
    let radians = convertAngleToRadians(angle, from);
    return convertAngleFromRadians(radians as number, to);
};

MeasureUnits.numberToString = function (number, selectedLocale, maximumFractionDigits, minimumFractionDigits) {
    return numberToFormattedString(number, selectedLocale, maximumFractionDigits, minimumFractionDigits);
};

MeasureUnits.distanceToString = function (
    meters,
    distanceUnits,
    selectedLocale,
    maximumFractionDigits,
    minimumFractionDigits
) {
    let distance = MeasureUnits.convertDistance(meters, DistanceUnits.METERS, distanceUnits);
    return (
        numberToFormattedString(distance, selectedLocale, maximumFractionDigits, minimumFractionDigits) +
        MeasureUnits.getDistanceUnitSpacing(distanceUnits) +
        MeasureUnits.getDistanceUnitSymbol(distanceUnits)
    );
};

MeasureUnits.areaToString = function (
    metersSquared,
    areaUnits,
    selectedLocale,
    maximumFractionDigits: number | undefined,
    minimumFractionDigits: number | undefined
) {
    let area = MeasureUnits.convertArea(metersSquared, AreaUnits.SQUARE_METERS, areaUnits);
    return (
        numberToFormattedString(area, selectedLocale, maximumFractionDigits, minimumFractionDigits) +
        MeasureUnits.getAreaUnitSpacing(areaUnits) +
        MeasureUnits.getAreaUnitSymbol(areaUnits)
    );
};

MeasureUnits.volumeToString = function (
    metersCubed,
    volumeUnits,
    selectedLocale,
    maximumFractionDigits,
    minimumFractionDigits
) {
    let volume = MeasureUnits.convertVolume(metersCubed, VolumeUnits.CUBIC_METERS, volumeUnits);
    return (
        numberToFormattedString(volume, selectedLocale, maximumFractionDigits, minimumFractionDigits) +
        MeasureUnits.getVolumeUnitSpacing(volumeUnits) +
        MeasureUnits.getVolumeUnitSymbol(volumeUnits)
    );
};

MeasureUnits.angleToString = function (
    angleRadians,
    angleUnits,
    selectedLocale,
    maximumFractionDigits,
    minimumFractionDigits
) {
    if (angleUnits === AngleUnits.DEGREES || angleUnits === AngleUnits.RADIANS || angleUnits === AngleUnits.GRADE) {
        let angle = convertAngleFromRadians(angleRadians, angleUnits);
        maximumFractionDigits = defaultValue(maximumFractionDigits, 6);
        return (
            numberToFormattedString(angle, selectedLocale, maximumFractionDigits, minimumFractionDigits) +
            MeasureUnits.getAngleUnitSpacing(angleUnits) +
            MeasureUnits.getAngleUnitSymbol(angleUnits)
        );
    } else if (angleUnits === AngleUnits.DEGREES_MINUTES_SECONDS) {
        let deg = CesiumMath.toDegrees(angleRadians);
        let sign = deg < 0 ? "-" : "";
        deg = Math.abs(deg);
        let d = Math.floor(deg);
        let minfloat = (deg - d) * 60;
        let m = Math.floor(minfloat);
        let s: string | number = (minfloat - m) * 60;
        s = numberToFormattedString(s, undefined, maximumFractionDigits, minimumFractionDigits); // The locale is undefined so that a period is used instead of a comma for the decimal
        return sign + d + "° " + m + "' " + s + '"';
    } else if (angleUnits === AngleUnits.RATIO) {
        let riseOverRun = convertAngleFromRadians(angleRadians, angleUnits);
        let run = 1.0 / riseOverRun;
        return "1:" + numberToFormattedString(run, selectedLocale, maximumFractionDigits, 0);
    }
};

MeasureUnits.longitudeToString = function (
    longitude,
    angleUnits,
    selectedLocale,
    maximumFractionDigits,
    minimumFractionDigits
) {
    return (
        MeasureUnits.angleToString(
            Math.abs(longitude),
            angleUnits,
            selectedLocale,
            maximumFractionDigits,
            minimumFractionDigits
        ) +
        " " +
        (longitude < 0.0 ? "W" : "E")
    );
};

MeasureUnits.latitudeToString = function (
    latitude,
    angleUnits,
    selectedLocale,
    maximumFractionDigits,
    minimumFractionDigits
) {
    return (
        MeasureUnits.angleToString(
            Math.abs(latitude),
            angleUnits,
            selectedLocale,
            maximumFractionDigits,
            minimumFractionDigits
        ) +
        " " +
        (latitude < 0.0 ? "S" : "N")
    );
};

MeasureUnits.getDistanceUnitSymbol = function (distanceUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("distanceUnits", distanceUnits);
    //>>includeEnd('debug');

    if (distanceUnits === DistanceUnits.METERS) {
        return "m";
    } else if (distanceUnits === DistanceUnits.CENTIMETERS) {
        return "cm";
    } else if (distanceUnits === DistanceUnits.KILOMETERS) {
        return "km";
    } else if (distanceUnits === DistanceUnits.FEET || distanceUnits === DistanceUnits.US_SURVEY_FEET) {
        return "ft";
    } else if (distanceUnits === DistanceUnits.INCHES) {
        return "in";
    } else if (distanceUnits === DistanceUnits.YARDS) {
        return "yd";
    } else if (distanceUnits === DistanceUnits.MILES) {
        return "mi";
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid distance units: " + distanceUnits);
    //>>includeEnd('debug');
};

MeasureUnits.getDistanceUnitSpacing = function (distanceUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("distanceUnits", distanceUnits);
    //>>includeEnd('debug');

    return " ";
};

MeasureUnits.getAreaUnitSymbol = function (areaUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("areaUnits", areaUnits);
    //>>includeEnd('debug');

    if (areaUnits === AreaUnits.SQUARE_METERS) {
        return "m²";
    } else if (areaUnits === AreaUnits.SQUARE_CENTIMETERS) {
        return "cm²";
    } else if (areaUnits === AreaUnits.SQUARE_KILOMETERS) {
        return "km²";
    } else if (areaUnits === AreaUnits.SQUARE_FEET) {
        return "sq ft";
    } else if (areaUnits === AreaUnits.SQUARE_INCHES) {
        return "sq in";
    } else if (areaUnits === AreaUnits.SQUARE_YARDS) {
        return "sq yd";
    } else if (areaUnits === AreaUnits.SQUARE_MILES) {
        return "sq mi";
    } else if (areaUnits === AreaUnits.ACRES) {
        return "ac";
    } else if (areaUnits === AreaUnits.HECTARES) {
        return "ha";
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid area units: " + areaUnits);
    //>>includeEnd('debug');
};

MeasureUnits.getAreaUnitSpacing = function (areaUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("areaUnits", areaUnits);
    //>>includeEnd('debug');

    return " ";
};

MeasureUnits.getVolumeUnitSymbol = function (volumeUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("volumeUnits", volumeUnits);
    //>>includeEnd('debug');

    if (volumeUnits === VolumeUnits.CUBIC_METERS) {
        return "m³";
    } else if (volumeUnits === VolumeUnits.CUBIC_CENTIMETERS) {
        return "cm³";
    } else if (volumeUnits === VolumeUnits.CUBIC_KILOMETERS) {
        return "km³";
    } else if (volumeUnits === VolumeUnits.CUBIC_FEET) {
        return "cu ft";
    } else if (volumeUnits === VolumeUnits.CUBIC_INCHES) {
        return "cu in";
    } else if (volumeUnits === VolumeUnits.CUBIC_YARDS) {
        return "cu yd";
    } else if (volumeUnits === VolumeUnits.CUBIC_MILES) {
        return "cu mi";
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid volume units: " + volumeUnits);
    //>>includeEnd('debug');
};

MeasureUnits.getVolumeUnitSpacing = function (volumeUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("volumeUnits", volumeUnits);
    //>>includeEnd('debug');

    return " ";
};

MeasureUnits.getAngleUnitSymbol = function (angleUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("angleUnits", angleUnits);
    //>>includeEnd('debug');

    if (angleUnits === AngleUnits.DEGREES) {
        return "°";
    } else if (angleUnits === AngleUnits.RADIANS) {
        return "rad";
    } else if (angleUnits === AngleUnits.GRADE) {
        return "%";
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid angle units: " + angleUnits);
    //>>includeEnd('debug');
};

MeasureUnits.getAngleUnitSpacing = function (angleUnits) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("angleUnits", angleUnits);
    //>>includeEnd('debug');

    if (angleUnits === AngleUnits.RADIANS) {
        return " ";
    }
    return "";
};

let negativeZero = -0.0;
let positiveZero = 0.0;

function numberToFormattedString(
    number: number,
    selectedLocale: string | string[] | undefined,
    maximumFractionDigits: number | undefined,
    minimumFractionDigits: number | undefined
) {
    maximumFractionDigits = defaultValue(maximumFractionDigits, 2);
    minimumFractionDigits = defaultValue(minimumFractionDigits, maximumFractionDigits);
    let localeStringOptions = {
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits
    };
    // If locale is undefined, the runtime's default locale is used.
    let numberString = number.toLocaleString(selectedLocale, localeStringOptions);
    let negativeZeroString = negativeZero.toLocaleString(selectedLocale, localeStringOptions);
    if (numberString === negativeZeroString) {
        return positiveZero.toLocaleString(selectedLocale, localeStringOptions);
    }
    return numberString;
}

function getDistanceUnitConversion(distanceUnits: string) {
    if (distanceUnits === DistanceUnits.METERS) {
        return 1.0;
    } else if (distanceUnits === DistanceUnits.CENTIMETERS) {
        return 0.01;
    } else if (distanceUnits === DistanceUnits.KILOMETERS) {
        return 1000.0;
    } else if (distanceUnits === DistanceUnits.FEET) {
        return 0.3048;
    } else if (distanceUnits === DistanceUnits.US_SURVEY_FEET) {
        return 1200.0 / 3937.0;
    } else if (distanceUnits === DistanceUnits.INCHES) {
        return 0.0254;
    } else if (distanceUnits === DistanceUnits.YARDS) {
        return 0.9144;
    } else if (distanceUnits === DistanceUnits.MILES) {
        return 1609.344;
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid distance units:" + distanceUnits);
    //>>includeEnd('debug');
}

function getAreaUnitConversion(areaUnits: string) {
    if (areaUnits === AreaUnits.SQUARE_METERS) {
        return 1.0;
    } else if (areaUnits === AreaUnits.SQUARE_CENTIMETERS) {
        return 0.0001;
    } else if (areaUnits === AreaUnits.SQUARE_KILOMETERS) {
        return 1000000.0;
    } else if (areaUnits === AreaUnits.SQUARE_FEET) {
        return 0.3048 * 0.3048;
    } else if (areaUnits === AreaUnits.SQUARE_INCHES) {
        return 0.0254 * 0.0254;
    } else if (areaUnits === AreaUnits.SQUARE_YARDS) {
        return 0.9144 * 0.9144;
    } else if (areaUnits === AreaUnits.SQUARE_MILES) {
        return 1609.344 * 1609.344;
    } else if (areaUnits === AreaUnits.ACRES) {
        return 4046.85642232;
    } else if (areaUnits === AreaUnits.HECTARES) {
        return 10000.0;
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid area units:" + areaUnits);
    //>>includeEnd('debug');
}

function getVolumeUnitConversion(volumeUnits: string) {
    if (volumeUnits === VolumeUnits.CUBIC_METERS) {
        return 1.0;
    } else if (volumeUnits === VolumeUnits.CUBIC_CENTIMETERS) {
        return 0.000001;
    } else if (volumeUnits === VolumeUnits.CUBIC_KILOMETERS) {
        return 1000000000.0;
    } else if (volumeUnits === VolumeUnits.CUBIC_FEET) {
        return 0.3048 * 0.3048 * 0.3048;
    } else if (volumeUnits === VolumeUnits.CUBIC_INCHES) {
        return 0.0254 * 0.0254 * 0.0254;
    } else if (volumeUnits === VolumeUnits.CUBIC_YARDS) {
        return 0.9144 * 0.9144 * 0.9144;
    } else if (volumeUnits === VolumeUnits.CUBIC_MILES) {
        return 1609.344 * 1609.344 * 1609.344;
    }
    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid volume units:" + volumeUnits);
    //>>includeEnd('debug');
}

let degreesMinutesSecondsRegex = /(-?)(\d+)\s*°\s*(\d+)\s*'\s*([\d.,]+)"\s*([WENS]?)/i;

function convertAngleToRadians(value: string | number, angleUnits: string) {
    if (angleUnits === AngleUnits.RADIANS) {
        return value;
    } else if (angleUnits === AngleUnits.DEGREES) {
        return CesiumMath.toRadians(value as number);
    } else if (angleUnits === AngleUnits.GRADE) {
        if (value === Number.POSITIVE_INFINITY) {
            return CesiumMath.PI_OVER_TWO;
        }
        return Math.atan((value as number) / 100.0);
    } else if (angleUnits === AngleUnits.RATIO) {
        // Converts to radians where value is rise/run
        return Math.atan(value as number);
    } else if (angleUnits === AngleUnits.DEGREES_MINUTES_SECONDS) {
        let matches = degreesMinutesSecondsRegex.exec(value as string);
        if (!matches) {
            throw new RuntimeError("Could not convert angle to radians: " + value);
        }
        let sign = matches[1].length > 0 ? -1.0 : 1.0;
        let degrees = parseInt(matches[2]);
        let minutes = parseInt(matches[3]);
        let seconds = parseFloat(matches[4]);
        let cardinal = matches[5];

        if (cardinal.length === 1) {
            cardinal = cardinal.toUpperCase();
            if (cardinal === "W" || cardinal === "S") {
                sign *= -1.0;
            }
        }

        let degreesDecimal = sign * (degrees + minutes / 60.0 + seconds / 3600.0);
        return CesiumMath.toRadians(degreesDecimal);
    }

    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid angle units: " + angleUnits);
    //>>includeEnd('debug');
}

function convertAngleFromRadians(value: number, angleUnits: string) {
    if (angleUnits === AngleUnits.RADIANS) {
        return value;
    } else if (angleUnits === AngleUnits.DEGREES) {
        return CesiumMath.toDegrees(value);
    } else if (angleUnits === AngleUnits.GRADE) {
        value = CesiumMath.clamp(value, 0.0, CesiumMath.PI_OVER_TWO);
        if (value === CesiumMath.PI_OVER_TWO) {
            return Number.POSITIVE_INFINITY;
        }
        return 100.0 * Math.tan(value);
    } else if (angleUnits === AngleUnits.RATIO) {
        let rise = Math.sin(value);
        let run = Math.cos(value);
        return rise / run;
    }

    //>>includeStart('debug', pragmas.debug);
    throw new DeveloperError("Invalid angle units: " + angleUnits);
    //>>includeEnd('debug');
}

export default MeasureUnits;
