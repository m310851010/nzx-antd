export abstract class BaseControl<T> {
  protected nzxDisabled?: boolean;
  onChange: (value: T) => void = () => null;
  onTouched: () => void = () => null;

  registerOnChange(fn: (_: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.nzxDisabled = isDisabled;
  }
}
