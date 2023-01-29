import React, { forwardRef, RefObject, useEffect, useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = TextInputProps & {
  inputContainerStyles?: StyleProp<ViewStyle>;
  firstInput: boolean;
  focusStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  numberOfInputs: number;
  handleTextChange: (text: string) => void;
  inputValue: string;
  handleKeyPress: (keyPressEvent: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
};

const majorVersionIOS: number = parseInt(`${Platform.Version}`, 10);
const isOTPSupported: boolean = Platform.OS === 'ios' && majorVersionIOS >= 12;

const OtpInput = forwardRef<TextInput, Props>(
  (
    {
      autoFocus,
      focusStyles,
      handleKeyPress,
      handleTextChange,
      inputContainerStyles,
      inputStyles,
      inputValue,
      placeholder,
      selectTextOnFocus,
      secureTextEntry,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      (ref as RefObject<TextInput>)?.current?.setNativeProps({
        value: inputValue,
        text: inputValue,
        secureTextEntry,
      });
    }, [ref, inputValue, secureTextEntry]);

    const restProps = useMemo(
      () =>
        Platform.select({
          default: rest,
          web: { value: inputValue, ...rest },
        }),
      [inputValue, rest],
    );

    return (
      // @ts-expect-error
     <View style={[inputContainerStyles, focused && focusStyles]}>
        {secureTextEntry && inputValue ? (
          //@ts-expect-error
          <View
            style={[
              inputContainerStyles,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                marginHorizontal: 0,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            {/* @ts-expect-error /}
            <View
              style={[
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  zIndex: 999,
                },
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  zIndex: 999,
                  width: 12,
                  height: 12,
                  backgroundColor: 'black',
                  borderRadius: 6,
                },
              ]}
            />
          </View>
        ) : null}
        {/ @ts-expect-error */}
        <TextInput
          autoFocus={autoFocus}
          onBlur={() => setFocused(false)}
          onChangeText={handleTextChange}
          onFocus={() => setFocused(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          ref={ref}
          secureTextEntry={secureTextEntry}
          // https://github.com/facebook/react-native/issues/18339
          selectTextOnFocus={Platform.select({
            ios: selectTextOnFocus,
            android: true,
          })}
          style={inputStyles}
          textContentType={isOTPSupported ? 'oneTimeCode' : 'none'}
          underlineColorAndroid="transparent"
          {...restProps}
        />
      </View>
    );
  },
);

export default React.memo(OtpInput);
