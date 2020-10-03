
# node-red-contrib-soma-smart-shade

A node that allows you to control a soma smart shade from Node Red.

## Actions

### Open, Close, Stop

To open, close or stop the blind pass in a message with a string payload of `open`, `close` or `stop`, or with an object payload an action property with the same values: 

```json
{
    "action": "open" 
}
```

### setPosition

To set the blind position a message payload with action and position must be passed:

```json
{
    "action": "setPosition",
    "position": 100,
}
```

### getBattery, getPosition

To query the state of the blind pass a message with a payload of `getBattery` or `getPosition` (or an object with an `action` property as above). A numeric `position` property will be on the response for `getPosition` and `battery_level` for `getBattery`. 

 * `position` will be a numeric value between `0` and `100`.
 * `battery_level` will be a numeric value between `320` and `420`. Anything below `360` is regarded as critical and the blind will not move.

## Responses

All responses will have the following properties:

```json
{
    "result": "success",
    "version": "2.2.0",
    "mac": "aa:bb:cc:dd:ee:ff"
}
```

 * **result** - `success` or `error`
 * **version** - the firmware version of the blind
 * **mac** - the MAC address of the blind.

 ### Additional Properties

 * **msg** - the error message if `result` is `error`
 * **position** - position of the blind if `action` is `getPosition`. Numeric value from `0` - `100`.
 * **battery_level** - battery level if `action` is `getBattery`. Nnumeric value from `320` to `420`.