<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'product_type' => ['required', Rule::in(['original', 'print', 'digital'])],
            'price' => ['required', 'numeric', 'min:0'],
            'price_usd' => ['nullable', 'numeric', 'min:0'],
            'width' => ['required', 'integer', 'min:1'],
            'height' => ['required', 'integer', 'min:1'],
            'medium' => ['required', 'string', 'max:100'],
            'year_created' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'status' => ['nullable', Rule::in(['available', 'sold'])],
            'is_featured' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:5120'], // Max 5MB per image
            'print_sizes' => ['nullable', 'array'],
            'print_sizes.*.size_name' => ['required_with:print_sizes', 'string', 'max:50'],
            'print_sizes.*.width' => ['required_with:print_sizes', 'integer', 'min:1'],
            'print_sizes.*.height' => ['required_with:print_sizes', 'integer', 'min:1'],
            'print_sizes.*.price' => ['required_with:print_sizes', 'numeric', 'min:0'],
            'print_sizes.*.price_usd' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'The selected category is invalid.',
            'title.required' => 'Product title is required.',
            'product_type.in' => 'Product type must be original, print, or digital.',
            'images.*.image' => 'Each file must be an image.',
            'images.*.max' => 'Each image must not exceed 5MB.',
        ];
    }
}
